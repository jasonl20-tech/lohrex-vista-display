import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BookOpen, Search, Filter, RefreshCw } from 'lucide-react';

interface SystemLog {
  id: string;
  log_level: string;
  message: string;
  module: string | null;
  ip_address: string | null;
  metadata: any;
  created_at: string;
}

export const SystemLogs = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      // Properly type the data to match our interface
      const typedLogs: SystemLog[] = (data || []).map(log => ({
        ...log,
        ip_address: log.ip_address ? String(log.ip_address) : null,
        module: log.module || null
      }));
      
      setLogs(typedLogs);
    } catch (error) {
      console.error('Fehler beim Laden der Logs:', error);
      toast.error('Fehler beim Laden der Logs');
    } finally {
      setLoading(false);
    }
  };

  const generateSampleLogs = async () => {
    try {
      const sampleLogs = [
        { log_level: 'info', message: 'User login successful', module: 'auth', ip_address: '192.168.1.1' },
        { log_level: 'warning', message: 'High memory usage detected', module: 'system', ip_address: '127.0.0.1' },
        { log_level: 'error', message: 'Database connection failed', module: 'database', ip_address: '10.0.0.1' },
        { log_level: 'debug', message: 'API request processed', module: 'api', ip_address: '172.16.0.1' },
        { log_level: 'info', message: 'Backup completed successfully', module: 'backup', ip_address: '127.0.0.1' }
      ];

      const { error } = await supabase
        .from('system_logs')
        .insert(sampleLogs);

      if (error) throw error;
      toast.success('Beispiel-Logs erstellt');
      await loadLogs();
    } catch (error) {
      console.error('Fehler beim Erstellen der Logs:', error);
      toast.error('Fehler beim Erstellen der Logs');
    }
  };

  const getLevelColor = (level: string) => {
    const colors = {
      info: 'bg-blue-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
      debug: 'bg-gray-500'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-500';
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.module?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.log_level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  if (loading) {
    return (
      <Card className="modern-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="modern-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-white">
            <BookOpen className="w-5 h-5 mr-2 text-red-400" />
            System-Logs
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={generateSampleLogs} variant="outline" className="border-blue-500/30 text-blue-400">
              Beispiel-Logs generieren
            </Button>
            <Button onClick={loadLogs} variant="outline" className="border-gray-500/30 text-gray-400">
              <RefreshCw className="w-4 h-4 mr-2" />
              Aktualisieren
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Logs durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-700 bg-gray-800/50 text-white"
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-48 border-gray-700 bg-gray-800/50 text-white">
              <SelectValue placeholder="Log-Level filtern" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">Alle Level</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Zeit</TableHead>
                <TableHead className="text-gray-300">Level</TableHead>
                <TableHead className="text-gray-300">Modul</TableHead>
                <TableHead className="text-gray-300">Nachricht</TableHead>
                <TableHead className="text-gray-300">IP-Adresse</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-gray-700">
                  <TableCell className="text-gray-400">
                    {new Date(log.created_at).toLocaleString('de-DE')}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-white ${getLevelColor(log.log_level)}`}>
                      {log.log_level.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white">{log.module || '-'}</TableCell>
                  <TableCell className="text-white">{log.message}</TableCell>
                  <TableCell className="text-gray-400">{log.ip_address || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
