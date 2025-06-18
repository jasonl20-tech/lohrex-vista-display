
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, FileText, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface PageContent {
  id: string;
  page_key: string;
  title: string;
  content: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export const PageManagement = () => {
  const [editingPage, setEditingPage] = useState<PageContent | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['page-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('page_key', { ascending: true });
      
      if (error) throw error;
      return data as PageContent[];
    }
  });

  const updatePageMutation = useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title: string; content: string }) => {
      const { error } = await supabase
        .from('page_content')
        .update({ 
          title, 
          content, 
          updated_by: (await supabase.auth.getUser()).data.user?.id,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      setEditingPage(null);
      setFormData({ title: '', content: '' });
      toast.success('Seite erfolgreich aktualisiert');
    },
    onError: (error) => {
      toast.error('Fehler beim Aktualisieren: ' + error.message);
    }
  });

  const handleEdit = (page: PageContent) => {
    setEditingPage(page);
    setFormData({ title: page.title, content: page.content });
  };

  const handleCancel = () => {
    setEditingPage(null);
    setFormData({ title: '', content: '' });
  };

  const handleSave = () => {
    if (!editingPage) return;
    updatePageMutation.mutate({
      id: editingPage.id,
      title: formData.title,
      content: formData.content
    });
  };

  const getPageDisplayName = (pageKey: string) => {
    switch (pageKey) {
      case 'datenschutz': return 'Datenschutzerklärung';
      case 'impressum': return 'Impressum';
      default: return pageKey;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Seitenverwaltung</h3>
        <Badge className="bg-blue-900/50 text-blue-400 border-blue-500/30">
          {pages.length} Seiten
        </Badge>
      </div>

      <div className="grid gap-6">
        {pages.map((page) => (
          <Card key={page.id} className="modern-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {getPageDisplayName(page.page_key)}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(page)}
                  className="border-blue-600 text-blue-400 hover:bg-blue-900/20"
                  disabled={editingPage?.id === page.id}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Bearbeiten
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editingPage?.id === page.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Titel
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="border-gray-700 bg-gray-800/50 text-white"
                      placeholder="Seitentitel..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Inhalt
                    </label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="border-gray-700 bg-gray-800/50 text-white min-h-[300px]"
                      placeholder="Seiteninhalt..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      className="modern-button bg-gradient-to-r from-green-600 to-green-700"
                      disabled={updatePageMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Speichern
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Abbrechen
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">{page.title}</h4>
                    <div className="text-gray-300 bg-gray-800/50 p-4 rounded-lg border border-gray-700 max-h-32 overflow-y-auto">
                      <p className="whitespace-pre-wrap">{page.content}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Letzte Aktualisierung: {new Date(page.updated_at).toLocaleString('de-DE')}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
