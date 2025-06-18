
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { ServiceForm } from './ServiceForm';
import { useState } from 'react';

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_items')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as ServiceItem[];
    }
  });

  const deleteMutation = useMutation({
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
      toast.error('Fehler beim Löschen: ' + error.message);
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from('service_items')
        .update({ active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['service-items'] });
      toast.success('Service-Status aktualisiert');
    },
    onError: (error) => {
      toast.error('Fehler beim Aktualisieren: ' + error.message);
    }
  });

  const handleEdit = (service: ServiceItem) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingService(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingService(null);
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
        <h3 className="text-2xl font-bold text-white">Service Management</h3>
        <Button onClick={handleCreate} className="modern-button bg-gradient-to-r from-red-600 to-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Neuer Service
        </Button>
      </div>

      {isFormOpen && (
        <ServiceForm
          service={editingService}
          onClose={handleCloseForm}
          onSuccess={() => {
            handleCloseForm();
            queryClient.invalidateQueries({ queryKey: ['admin-services'] });
            queryClient.invalidateQueries({ queryKey: ['service-items'] });
          }}
        />
      )}

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id} className="modern-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-white flex items-center gap-2">
                    {service.title}
                    {service.featured && (
                      <Badge className="bg-yellow-900/50 text-yellow-400 border-yellow-500/30">
                        Featured
                      </Badge>
                    )}
                    <Badge 
                      className={service.active 
                        ? "bg-green-900/50 text-green-400 border-green-500/30" 
                        : "bg-gray-900/50 text-gray-400 border-gray-500/30"
                      }
                    >
                      {service.active ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </CardTitle>
                  <p className="text-gray-400 mt-2">{service.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="bg-blue-900/50 text-blue-400">
                      {service.category}
                    </Badge>
                    {service.price && (
                      <Badge variant="secondary" className="bg-green-900/50 text-green-400">
                        ab {service.price}€
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-gray-800/50 text-gray-300">
                      Reihenfolge: {service.sort_order}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActiveMutation.mutate({ 
                      id: service.id, 
                      active: !service.active 
                    })}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    {service.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(service)}
                    className="border-blue-600 text-blue-400 hover:bg-blue-900/20"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('Service wirklich löschen?')) {
                        deleteMutation.mutate(service.id);
                      }
                    }}
                    className="border-red-600 text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
