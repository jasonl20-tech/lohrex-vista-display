
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Send, Plus, Mail, Users, Eye } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  name: string;
  status: string;
  subscribed_at: string;
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: string;
  sent_count: number;
  open_count: number;
  created_at: string;
}

export const NewsletterManagement = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subscribersResult, campaignsResult] = await Promise.all([
        supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false }),
        supabase.from('email_campaigns').select('*').order('created_at', { ascending: false })
      ]);

      if (subscribersResult.error) throw subscribersResult.error;
      if (campaignsResult.error) throw campaignsResult.error;

      setSubscribers(subscribersResult.data || []);
      setCampaigns(campaignsResult.data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Newsletter-Daten:', error);
      toast.error('Fehler beim Laden der Newsletter-Daten');
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('email_campaigns')
        .insert({
          name: formData.name,
          subject: formData.subject,
          content: formData.content,
          status: 'draft'
        });

      if (error) throw error;
      toast.success('Kampagne erstellt');
      setIsDialogOpen(false);
      setFormData({ name: '', subject: '', content: '' });
      await loadData();
    } catch (error) {
      console.error('Fehler beim Erstellen der Kampagne:', error);
      toast.error('Fehler beim Erstellen der Kampagne');
    }
  };

  const sendCampaign = async (campaignId: string) => {
    try {
      const { error } = await supabase
        .from('email_campaigns')
        .update({ 
          status: 'sent', 
          sent_at: new Date().toISOString(),
          sent_count: subscribers.length 
        })
        .eq('id', campaignId);

      if (error) throw error;
      toast.success('Kampagne versendet');
      await loadData();
    } catch (error) {
      console.error('Fehler beim Versenden der Kampagne:', error);
      toast.error('Fehler beim Versenden der Kampagne');
    }
  };

  const addSubscriber = async () => {
    const email = prompt('E-Mail-Adresse eingeben:');
    const name = prompt('Name eingeben (optional):');
    
    if (!email) return;

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, name: name || null });

      if (error) throw error;
      toast.success('Abonnent hinzugefügt');
      await loadData();
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Abonnenten:', error);
      toast.error('Fehler beim Hinzufügen des Abonnenten');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-500',
      scheduled: 'bg-blue-500',
      sent: 'bg-green-500',
      cancelled: 'bg-red-500',
      active: 'bg-green-500',
      unsubscribed: 'bg-red-500'
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Newsletter-Verwaltung</h2>
        <div className="flex gap-2">
          <Button onClick={addSubscriber} variant="outline" className="border-blue-500/30 text-blue-400">
            <Users className="w-4 h-4 mr-2" />
            Abonnent hinzufügen
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="modern-button">
                <Plus className="w-4 h-4 mr-2" />
                Neue Kampagne
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Neue E-Mail Kampagne</DialogTitle>
              </DialogHeader>
              <form onSubmit={createCampaign} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Kampagnen-Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="border-gray-700 bg-gray-800/50 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Betreff</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="border-gray-700 bg-gray-800/50 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Inhalt</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="border-gray-700 bg-gray-800/50 text-white"
                    rows={8}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Abbrechen
                  </Button>
                  <Button type="submit" className="modern-button">
                    Kampagne erstellen
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900/50">
          <TabsTrigger value="campaigns" className="text-white data-[state=active]:bg-red-900/50">
            Kampagnen
          </TabsTrigger>
          <TabsTrigger value="subscribers" className="text-white data-[state=active]:bg-red-900/50">
            Abonnenten
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-white">E-Mail Kampagnen</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Betreff</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Versendet</TableHead>
                    <TableHead className="text-gray-300">Öffnungen</TableHead>
                    <TableHead className="text-gray-300">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id} className="border-gray-700">
                      <TableCell className="text-white">{campaign.name}</TableCell>
                      <TableCell className="text-white">{campaign.subject}</TableCell>
                      <TableCell>
                        <Badge className={`text-white ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">{campaign.sent_count}</TableCell>
                      <TableCell className="text-white">{campaign.open_count}</TableCell>
                      <TableCell>
                        {campaign.status === 'draft' && (
                          <Button
                            size="sm"
                            onClick={() => sendCampaign(campaign.id)}
                            className="modern-button-outline border-green-500/30 text-green-400"
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Senden
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-white">Newsletter-Abonnenten</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">E-Mail</TableHead>
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Abonniert seit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id} className="border-gray-700">
                      <TableCell className="text-white">{subscriber.email}</TableCell>
                      <TableCell className="text-white">{subscriber.name || '-'}</TableCell>
                      <TableCell>
                        <Badge className={`text-white ${getStatusColor(subscriber.status)}`}>
                          {subscriber.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {new Date(subscriber.subscribed_at).toLocaleDateString('de-DE')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
