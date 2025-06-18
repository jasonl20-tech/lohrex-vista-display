
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, File, Trash2, Download, Search } from 'lucide-react';

interface FileItem {
  id: string;
  filename: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export const FileManager = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('file_manager')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Dateien:', error);
      toast.error('Fehler beim Laden der Dateien');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Simuliere File Upload (in der Realität würde man hier zu Supabase Storage uploaden)
      const filename = `${Date.now()}_${file.name}`;
      const filePath = `/uploads/${filename}`;

      const { error } = await supabase
        .from('file_manager')
        .insert({
          filename: filename,
          original_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type
        });

      if (error) throw error;
      toast.success('Datei erfolgreich hochgeladen');
      await loadFiles();
    } catch (error) {
      console.error('Fehler beim Hochladen der Datei:', error);
      toast.error('Fehler beim Hochladen der Datei');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const deleteFile = async (id: string) => {
    if (!confirm('Datei wirklich löschen?')) return;

    try {
      const { error } = await supabase
        .from('file_manager')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Datei gelöscht');
      await loadFiles();
    } catch (error) {
      console.error('Fehler beim Löschen der Datei:', error);
      toast.error('Fehler beim Löschen der Datei');
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(file => 
    file.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.mime_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <File className="w-5 h-5 mr-2 text-red-400" />
            Datei-Manager
          </CardTitle>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              multiple={false}
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="modern-button"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Lade hoch...' : 'Datei hochladen'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Dateien suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-700 bg-gray-800/50 text-white"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Dateiname</TableHead>
                <TableHead className="text-gray-300">Typ</TableHead>
                <TableHead className="text-gray-300">Größe</TableHead>
                <TableHead className="text-gray-300">Hochgeladen</TableHead>
                <TableHead className="text-gray-300">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id} className="border-gray-700">
                  <TableCell className="text-white">{file.original_name}</TableCell>
                  <TableCell className="text-white">{file.mime_type}</TableCell>
                  <TableCell className="text-white">{formatFileSize(file.file_size)}</TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(file.created_at).toLocaleDateString('de-DE')}
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
                        onClick={() => deleteFile(file.id)}
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
