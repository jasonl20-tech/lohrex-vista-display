import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Mail, Eye, Reply, Clock, ArrowUp, ArrowDown, AlertCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  priority: 'low' | 'normal' | 'high';
  created_at: string;
  updated_at: string;
}

export const ContactMessages = () => {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContactMessage[];
    }
  });

  const updateMessageMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ContactMessage> }) => {
      const { error } = await supabase
        .from('contact_messages')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      toast.success('Nachricht aktualisiert');
    },
    onError: (error) => {
      toast.error('Fehler beim Aktualisieren: ' + error.message);
    }
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      toast.success('Nachricht gelöscht');
      // Reset selected message if it was the deleted one
      if (selectedMessage && selectedMessage.id === arguments[0]) {
        setSelectedMessage(null);
      }
    },
    onError: (error) => {
      toast.error('Fehler beim Löschen: ' + error.message);
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
      updateMessageMutation.mutate({ id: message.id, updates: { status: 'read' } });
    }
  };

  const handleReply = (email: string) => {
    window.location.href = `mailto:${email}`;
    if (selectedMessage) {
      updateMessageMutation.mutate({ id: selectedMessage.id, updates: { status: 'replied' } });
    }
  };

  const handleStatusChange = (messageId: string, status: string) => {
    updateMessageMutation.mutate({ 
      id: messageId, 
      updates: { status: status as 'unread' | 'read' | 'replied' } 
    });
    if (selectedMessage?.id === messageId) {
      setSelectedMessage({ ...selectedMessage, status: status as 'unread' | 'read' | 'replied' });
    }
  };

  const handlePriorityChange = (messageId: string, priority: string) => {
    updateMessageMutation.mutate({ 
      id: messageId, 
      updates: { priority: priority as 'low' | 'normal' | 'high' } 
    });
    if (selectedMessage?.id === messageId) {
      setSelectedMessage({ ...selectedMessage, priority: priority as 'low' | 'normal' | 'high' });
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessageMutation.mutate(messageId);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-900/50 text-red-400 border-red-500/30';
      case 'normal': return 'bg-blue-900/50 text-blue-400 border-blue-500/30';
      case 'low': return 'bg-gray-900/50 text-gray-400 border-gray-500/30';
      default: return 'bg-blue-900/50 text-blue-400 border-blue-500/30';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Hoch';
      case 'normal': return 'Normal';
      case 'low': return 'Niedrig';
      default: return 'Normal';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-3 h-3" />;
      case 'low': return <ArrowDown className="w-3 h-3" />;
      default: return null;
    }
  };

  const filteredMessages = messages.filter(message => {
    const statusMatch = filterStatus === 'all' || message.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || message.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

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
        <div className="flex gap-4 items-center">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Status filtern" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="unread">Ungelesen</SelectItem>
              <SelectItem value="read">Gelesen</SelectItem>
              <SelectItem value="replied">Beantwortet</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Priorität filtern" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">Alle Prioritäten</SelectItem>
              <SelectItem value="high">Hoch</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="low">Niedrig</SelectItem>
            </SelectContent>
          </Select>
          <Badge className="bg-blue-900/50 text-blue-400 border-blue-500/30">
            {messages.filter(m => m.status === 'unread').length} ungelesen
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nachrichten-Liste */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Nachrichten ({filteredMessages.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              <div className="space-y-2 p-4">
                {filteredMessages.map((message) => (
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
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-white truncate">{message.name}</h4>
                        {getPriorityIcon(message.priority || 'normal')}
                      </div>
                      <div className="flex gap-1">
                        <Badge className={getPriorityColor(message.priority || 'normal')}>
                          {getPriorityText(message.priority || 'normal')}
                        </Badge>
                        <Badge className={getStatusColor(message.status)}>
                          {getStatusText(message.status)}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{message.email}</p>
                    <p className="text-sm text-gray-300 line-clamp-2">{message.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {format(new Date(message.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-900 border-gray-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Nachricht löschen</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300">
                              Sind Sie sicher, dass Sie diese Nachricht von {message.name} löschen möchten? 
                              Diese Aktion kann nicht rückgängig gemacht werden.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                              Abbrechen
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteMessage(message.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Löschen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
                {filteredMessages.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    {messages.length === 0 ? 'Keine Kontaktanfragen vorhanden' : 'Keine Nachrichten entsprechen den Filterkriterien'}
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">Status:</label>
                    <Select 
                      value={selectedMessage.status} 
                      onValueChange={(value) => handleStatusChange(selectedMessage.id, value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="unread">Ungelesen</SelectItem>
                        <SelectItem value="read">Gelesen</SelectItem>
                        <SelectItem value="replied">Beantwortet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">Priorität:</label>
                    <Select 
                      value={selectedMessage.priority || 'normal'} 
                      onValueChange={(value) => handlePriorityChange(selectedMessage.id, value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="high">Hoch</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Niedrig</SelectItem>
                      </SelectContent>
                    </Select>
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
                      onClick={() => handleStatusChange(selectedMessage.id, 'read')}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Als gelesen markieren
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Löschen
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-900 border-gray-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Nachricht löschen</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                          Sind Sie sicher, dass Sie diese Nachricht von {selectedMessage.name} löschen möchten? 
                          Diese Aktion kann nicht rückgängig gemacht werden.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                          Abbrechen
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteMessage(selectedMessage.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Löschen
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
