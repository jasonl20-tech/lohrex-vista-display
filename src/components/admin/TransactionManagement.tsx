import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CreditCard, Plus, TrendingUp, TrendingDown, Euro } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  description: string;
  category: string;
  transaction_date: string;
  reference_number: string;
  created_by: string;
  created_at: string;
}

export const TransactionManagement = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    transaction_type: 'income',
    amount: '',
    description: '',
    category: '',
    transaction_date: new Date().toISOString().split('T')[0],
    reference_number: ''
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Transaktionen:', error);
      toast.error('Fehler beim Laden der Transaktionen');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Sie müssen angemeldet sein');
      return;
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          ...formData,
          amount: parseFloat(formData.amount),
          created_by: user.id
        });

      if (error) throw error;
      
      toast.success('Transaktion hinzugefügt');
      setIsDialogOpen(false);
      setFormData({
        transaction_type: 'income',
        amount: '',
        description: '',
        category: '',
        transaction_date: new Date().toISOString().split('T')[0],
        reference_number: ''
      });
      await loadTransactions();
    } catch (error) {
      console.error('Fehler beim Speichern der Transaktion:', error);
      toast.error('Fehler beim Speichern der Transaktion');
    }
  };

  const getTotalByType = (type: string) => {
    return transactions
      .filter(t => t.transaction_type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBalance = () => {
    return getTotalByType('income') - getTotalByType('expense');
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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Einnahmen</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              €{getTotalByType('income').toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Ausgaben</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              €{getTotalByType('expense').toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Saldo</CardTitle>
            <Euro className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getBalance() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              €{getBalance().toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="modern-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-white">
              <CreditCard className="w-5 h-5 mr-2 text-red-400" />
              Transaktionsverwaltung
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="modern-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Neue Transaktion
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Neue Transaktion hinzufügen</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Typ</Label>
                      <Select 
                        value={formData.transaction_type} 
                        onValueChange={(value) => setFormData({...formData, transaction_type: value})}
                      >
                        <SelectTrigger className="border-gray-700 bg-gray-800/50 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="income">Einnahme</SelectItem>
                          <SelectItem value="expense">Ausgabe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Beschreibung</Label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Datum</Label>
                      <Input
                        type="date"
                        value={formData.transaction_date}
                        onChange={(e) => setFormData({...formData, transaction_date: e.target.value})}
                        className="border-gray-700 bg-gray-800/50 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Referenz</Label>
                    <Input
                      value={formData.reference_number}
                      onChange={(e) => setFormData({...formData, reference_number: e.target.value})}
                      className="border-gray-700 bg-gray-800/50 text-white"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Abbrechen
                    </Button>
                    <Button type="submit" className="modern-button">
                      Hinzufügen
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
                  <TableHead className="text-gray-300">Datum</TableHead>
                  <TableHead className="text-gray-300">Typ</TableHead>
                  <TableHead className="text-gray-300">Beschreibung</TableHead>
                  <TableHead className="text-gray-300">Kategorie</TableHead>
                  <TableHead className="text-gray-300">Betrag</TableHead>
                  <TableHead className="text-gray-300">Referenz</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-gray-700">
                    <TableCell className="text-white">
                      {new Date(transaction.transaction_date).toLocaleDateString('de-DE')}
                    </TableCell>
                    <TableCell>
                      <Badge className={transaction.transaction_type === 'income' ? 'bg-green-500' : 'bg-red-500'}>
                        {transaction.transaction_type === 'income' ? 'Einnahme' : 'Ausgabe'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">{transaction.description}</TableCell>
                    <TableCell className="text-gray-400">{transaction.category || '-'}</TableCell>
                    <TableCell className={`font-medium ${transaction.transaction_type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                      {transaction.transaction_type === 'income' ? '+' : '-'}€{transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-gray-400">{transaction.reference_number || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
