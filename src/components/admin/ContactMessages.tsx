
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mail, Eye, Reply, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
}

export const ContactMessages = () => {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContactMessage[];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      toast.success('Status aktualisiert');
    },
    onError: (error) => {
      toast.error('Fehler beim Aktualisieren: ' + error.message);
    }
  });

  // Realtime subscription für neue Nachrichten
  useEffect(() => {
    const channel = supabase
      .channel('contact-messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_messages'
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
          toast.success('Neue Kontaktanfrage erhalten!');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleMessageClick = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      updateStatusMutation.mutate({ id: message.id, status: 'read' });
    }
  };

  const handleReply = (email: string) => {
    window.location.href = `mailto:${email}`;
    if (selectedMessage) {
      updateStatusMutation.mutate({ id: selectedMessage.id, status: 'replied' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-900/50 text-red-400 border-red-500/30';
      case 'read': return 'bg-yellow-900/50 text-yellow-400 border-yellow-500/30';
      case 'replied': return 'bg-green-900/50 text-green-400 border-green-500/30';
      default: return 'bg-gray-900/50 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'unread': return 'Ungelesen';
      case 'read': return 'Gelesen';
      case 'replied': return 'Beantwortet';
      default: return status;
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
        <h3 className="text-2xl font-bold text-white">Kontaktanfragen</h3>
        <Badge className="bg-blue-900/50 text-blue-400 border-blue-500/30">
          {messages.filter(m => m.status === 'unread').length} ungelesen
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nachrichten-Liste */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Nachrichten ({messages.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              <div className="space-y-2 p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => handleMessageClick(message)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'bg-red-900/20 border-red-500/50'
                        : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white truncate">{message.name}</h4>
                      <Badge className={getStatusColor(message.status)}>
                        {getStatusText(message.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{message.email}</p>
                    <p className="text-sm text-gray-300 line-clamp-2">{message.message}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {format(new Date(message.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    Keine Kontaktanfragen vorhanden
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Nachricht Details */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="text-white">
              {selectedMessage ? 'Nachricht Details' : 'Nachricht auswählen'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Von:</label>
                  <p className="text-white">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Email:</label>
                  <p className="text-white">{selectedMessage.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Empfangen am:</label>
                  <p className="text-white">
                    {format(new Date(selectedMessage.created_at), 'dd. MMMM yyyy, HH:mm', { locale: de })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Status:</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedMessage.status)}>
                      {getStatusText(selectedMessage.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Nachricht:</label>
                  <div className="mt-2 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-white whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleReply(selectedMessage.email)}
                    className="modern-button bg-gradient-to-r from-blue-600 to-blue-700"
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Antworten
                  </Button>
                  {selectedMessage.status !== 'read' && (
                    <Button
                      variant="outline"
                      onClick={() => updateStatusMutation.mutate({ id: selectedMessage.id, status: 'read' })}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Als gelesen markieren
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                Wählen Sie eine Nachricht aus der Liste aus
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
