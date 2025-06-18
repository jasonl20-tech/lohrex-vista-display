
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StickyNote, Plus, Edit, Trash2 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

export const NotesManagement = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    priority: 'normal'
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Notizen:', error);
      toast.error('Fehler beim Laden der Notizen');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const noteData = {
        title: formData.title,
        content: formData.content,
        category: formData.category || null,
        priority: formData.priority
      };

      if (editingNote) {
        const { error } = await supabase
          .from('admin_notes')
          .update({ ...noteData, updated_at: new Date().toISOString() })
          .eq('id', editingNote.id);
        if (error) throw error;
        toast.success('Notiz aktualisiert');
      } else {
        const { error } = await supabase
          .from('admin_notes')
          .insert(noteData);
        if (error) throw error;
        toast.success('Notiz erstellt');
      }

      setIsDialogOpen(false);
      setEditingNote(null);
      setFormData({
        title: '',
        content: '',
        category: '',
        priority: 'normal'
      });
      await loadNotes();
    } catch (error) {
      console.error('Fehler beim Speichern der Notiz:', error);
      toast.error('Fehler beim Speichern der Notiz');
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category || '',
      priority: note.priority || 'normal'
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Notiz wirklich löschen?')) return;

    try {
      const { error } = await supabase
        .from('admin_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Notiz gelöscht');
      await loadNotes();
    } catch (error) {
      console.error('Fehler beim Löschen der Notiz:', error);
      toast.error('Fehler beim Löschen der Notiz');
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-500',
      normal: 'bg-blue-500',
      high: 'bg-red-500'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-500';
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
            <StickyNote className="w-5 h-5 mr-2 text-red-400" />
            Notizen-Verwaltung
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="modern-button">
                <Plus className="w-4 h-4 mr-2" />
                Neue Notiz
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingNote ? 'Notiz bearbeiten' : 'Neue Notiz erstellen'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Titel</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="border-gray-700 bg-gray-800/50 text-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Kategorie</Label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="border-gray-700 bg-gray-800/50 text-white"
                      placeholder="z.B. Projekt, Bug, Idee"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Priorität</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                      <SelectTrigger className="border-gray-700 bg-gray-800/50 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="low">Niedrig</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">Hoch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Inhalt</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="border-gray-700 bg-gray-800/50 text-white"
                    rows={6}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Abbrechen
                  </Button>
                  <Button type="submit" className="modern-button">
                    {editingNote ? 'Aktualisieren' : 'Erstellen'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <Card key={note.id} className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-white">{note.title}</CardTitle>
                  <div className="flex gap-1">
                    <Badge className={`text-white ${getPriorityColor(note.priority)}`}>
                      {note.priority}
                    </Badge>
                  </div>
                </div>
                {note.category && (
                  <Badge variant="secondary" className="w-fit bg-gray-700 text-gray-300">
                    {note.category}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300 text-sm line-clamp-4">{note.content}</p>
                <div className="text-xs text-gray-400">
                  Erstellt: {new Date(note.created_at).toLocaleDateString('de-DE')}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(note)}
                    className="flex-1 border-blue-500/30 text-blue-400 hover:bg-blue-900/20"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Bearbeiten
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(note.id)}
                    className="border-red-500/30 text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
