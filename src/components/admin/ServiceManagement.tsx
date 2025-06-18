
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { ServiceForm } from './ServiceForm';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  price: number | null;
  active: boolean;
  featured: boolean;
  sort_order: number;
  button_text: string;
  service_url: string | null;
  created_at: string;
  updated_at: string;
}

export const ServiceManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_items')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }
      
      return data as ServiceItem[];
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from('service_items')
        .update({ active, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['service-items'] });
      toast.success('Service-Status aktualisiert');
    },
    onError: (error) => {
      console.error('Error updating service:', error);
      toast.error('Fehler beim Aktualisieren des Service-Status');
    }
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('service_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['service-items'] });
      toast.success('Service gelöscht');
    },
    onError: (error) => {
      console.error('Error deleting service:', error);
      toast.error('Fehler beim Löschen des Services');
    }
  });

  const handleEdit = (service: ServiceItem) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Sind Sie sicher, dass Sie diesen Service löschen möchten?')) {
      deleteServiceMutation.mutate(id);
    }
  };

  const handleToggleActive = (id: string, currentActive: boolean) => {
    toggleActiveMutation.mutate({ id, active: !currentActive });
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingService(null);
    queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    queryClient.invalidateQueries({ queryKey: ['service-items'] });
  };

  if (showForm) {
    return (
      <ServiceForm
        service={editingService}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingService(null);
        }}
      />
    );
  }

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
        <div>
          <h3 className="text-2xl font-bold text-white">Service-Verwaltung</h3>
          <p className="text-gray-400">Verwalten Sie Ihre Services und Angebote</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="modern-button bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Neuer Service
        </Button>
      </div>

      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="text-white">Services ({services.length})</CardTitle>
          <CardDescription className="text-gray-400">
            Übersicht aller Services mit Status und Kategorien
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Titel</TableHead>
                <TableHead className="text-gray-300">Kategorie</TableHead>
                <TableHead className="text-gray-300">Preis</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Reihenfolge</TableHead>
                <TableHead className="text-gray-300 text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id} className="border-gray-700">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-white">{service.title}</div>
                      <div className="text-sm text-gray-400 truncate max-w-xs">
                        {service.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                      {service.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {service.price ? `${service.price}€` : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={service.active 
                          ? "bg-green-900/50 text-green-400 border-green-500/30" 
                          : "bg-gray-900/50 text-gray-400 border-gray-500/30"
                        }
                      >
                        {service.active ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                      {service.featured && (
                        <Badge className="bg-yellow-900/50 text-yellow-400 border-yellow-500/30">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {service.sort_order}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(service.id, service.active)}
                        className="text-gray-400 hover:text-white"
                      >
                        {service.active ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(service)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
