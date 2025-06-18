
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FileText, Plus, Edit, Trash2, Euro } from 'lucide-react';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  due_date: string;
  invoice_date: string;
  description: string;
  created_at: string;
}

export const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_address: '',
    amount: '',
    tax_amount: '',
    description: '',
    due_date: '',
    status: 'draft'
  });

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Rechnungen:', error);
      toast.error('Fehler beim Laden der Rechnungen');
    } finally {
      setLoading(false);
    }
  };

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `RE-${year}${month}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const amount = parseFloat(formData.amount);
      const taxAmount = parseFloat(formData.tax_amount || '0');
      const totalAmount = amount + taxAmount;

      const invoiceData = {
        invoice_number: editingInvoice?.invoice_number || generateInvoiceNumber(),
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_address: formData.customer_address,
        amount: amount,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        description: formData.description,
        due_date: formData.due_date,
        status: formData.status
      };

      if (editingInvoice) {
        const { error } = await supabase
          .from('invoices')
          .update(invoiceData)
          .eq('id', editingInvoice.id);
        if (error) throw error;
        toast.success('Rechnung aktualisiert');
      } else {
        const { error } = await supabase
          .from('invoices')
          .insert(invoiceData);
        if (error) throw error;
        toast.success('Rechnung erstellt');
      }

      setIsDialogOpen(false);
      setEditingInvoice(null);
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_address: '',
        amount: '',
        tax_amount: '',
        description: '',
        due_date: '',
        status: 'draft'
      });
      await loadInvoices();
    } catch (error) {
      console.error('Fehler beim Speichern der Rechnung:', error);
      toast.error('Fehler beim Speichern der Rechnung');
    }
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      customer_name: invoice.customer_name,
      customer_email: invoice.customer_email || '',
      customer_address: invoice.customer_address || '',
      amount: invoice.amount.toString(),
      tax_amount: invoice.tax_amount.toString(),
      description: invoice.description || '',
      due_date: invoice.due_date || '',
      status: invoice.status || 'draft'
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Rechnung wirklich löschen?')) return;

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Rechnung gelöscht');
      await loadInvoices();
    } catch (error) {
      console.error('Fehler beim Löschen der Rechnung:', error);
      toast.error('Fehler beim Löschen der Rechnung');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      draft: 'bg-gray-500',
      sent: 'bg-blue-500',
      paid: 'bg-green-500',
      overdue: 'bg-red-500',
      cancelled: 'bg-gray-700'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-500';
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
            <FileText className="w-5 h-5 mr-2 text-red-400" />
            Rechnungsverwaltung
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="modern-button">
                <Plus className="w-4 h-4 mr-2" />
                Neue Rechnung
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingInvoice ? 'Rechnung bearbeiten' : 'Neue Rechnung erstellen'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Kunde</Label>
                    <Input
                      value={formData.customer_name}
                      onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                      className="border-gray-700 bg-gray-800/50 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">E-Mail</Label>
                    <Input
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                      className="border-gray-700 bg-gray-800/50 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Adresse</Label>
                  <Textarea
                    value={formData.customer_address}
                    onChange={(e) => setFormData({...formData, customer_address: e.target.value})}
                    className="border-gray-700 bg-gray-800/50 text-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Betrag (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="border-gray-700 bg-gray-800/50 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">MwSt. (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.tax_amount}
                      onChange={(e) => setFormData({...formData, tax_amount: e.target.value})}
                      className="border-gray-700 bg-gray-800/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Fälligkeitsdatum</Label>
                    <Input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                      className="border-gray-700 bg-gray-800/50 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger className="border-gray-700 bg-gray-800/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="draft">Entwurf</SelectItem>
                      <SelectItem value="sent">Versendet</SelectItem>
                      <SelectItem value="paid">Bezahlt</SelectItem>
                      <SelectItem value="overdue">Überfällig</SelectItem>
                      <SelectItem value="cancelled">Storniert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Beschreibung</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="border-gray-700 bg-gray-800/50 text-white"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Abbrechen
                  </Button>
                  <Button type="submit" className="modern-button">
                    {editingInvoice ? 'Aktualisieren' : 'Erstellen'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Rechnungsnr.</TableHead>
                <TableHead className="text-gray-300">Kunde</TableHead>
                <TableHead className="text-gray-300">Betrag</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Fällig</TableHead>
                <TableHead className="text-gray-300">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-gray-700">
                  <TableCell className="text-white">{invoice.invoice_number}</TableCell>
                  <TableCell className="text-white">{invoice.customer_name}</TableCell>
                  <TableCell className="text-white">
                    <div className="flex items-center">
                      <Euro className="w-4 h-4 mr-1" />
                      {invoice.total_amount.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-white ${getStatusBadge(invoice.status)}`}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('de-DE') : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(invoice)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(invoice.id)}
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
