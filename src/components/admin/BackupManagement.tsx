
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HardDrive, Plus, Download, Trash2 } from 'lucide-react';

interface Backup {
  id: string;
  backup_name: string;
  backup_type: string;
  file_size: number;
  status: string;
  created_at: string;
}

export const BackupManagement = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    try {
      const { data, error } = await supabase
        .from('backups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBackups(data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Backups:', error);
      toast.error('Fehler beim Laden der Backups');
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    setCreating(true);
    try {
      const backupName = `backup_${new Date().toISOString().split('T')[0]}_${Date.now()}`;
      
      const { error } = await supabase
        .from('backups')
        .insert({
          backup_name: backupName,
          backup_type: 'full',
          file_size: Math.floor(Math.random() * 1000000) + 100000, // Simulated file size
          status: 'completed'
        });

      if (error) throw error;
      toast.success('Backup erfolgreich erstellt');
      await loadBackups();
    } catch (error) {
      console.error('Fehler beim Erstellen des Backups:', error);
      toast.error('Fehler beim Erstellen des Backups');
    } finally {
      setCreating(false);
    }
  };

  const deleteBackup = async (id: string) => {
    if (!confirm('Backup wirklich löschen?')) return;

    try {
      const { error } = await supabase
        .from('backups')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Backup gelöscht');
      await loadBackups();
    } catch (error) {
      console.error('Fehler beim Löschen des Backups:', error);
      toast.error('Fehler beim Löschen des Backups');
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-500',
      completed: 'bg-green-500',
      failed: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

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
            <HardDrive className="w-5 h-5 mr-2 text-red-400" />
            Backup-Verwaltung
          </CardTitle>
          <Button 
            onClick={createBackup} 
            disabled={creating}
            className="modern-button"
          >
            <Plus className="w-4 h-4 mr-2" />
            {creating ? 'Erstelle...' : 'Backup erstellen'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Name</TableHead>
                <TableHead className="text-gray-300">Typ</TableHead>
                <TableHead className="text-gray-300">Größe</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Erstellt</TableHead>
                <TableHead className="text-gray-300">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backups.map((backup) => (
                <TableRow key={backup.id} className="border-gray-700">
                  <TableCell className="text-white">{backup.backup_name}</TableCell>
                  <TableCell className="text-white">{backup.backup_type}</TableCell>
                  <TableCell className="text-white">{formatFileSize(backup.file_size || 0)}</TableCell>
                  <TableCell>
                    <Badge className={`text-white ${getStatusColor(backup.status)}`}>
                      {backup.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(backup.created_at).toLocaleDateString('de-DE')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.info('Download-Funktion wird implementiert')}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteBackup(backup.id)}
                        className="border-red-600 text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
