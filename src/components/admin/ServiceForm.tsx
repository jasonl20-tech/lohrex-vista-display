
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';

interface ServiceFormData {
  title: string;
  description: string;
  icon: string;
  category: string;
  price: number | null;
  active: boolean;
  featured: boolean;
  sort_order: number;
  button_text: string;
  service_url: string;
}

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

interface ServiceFormProps {
  service?: ServiceItem | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const iconOptions = [
  'Code', 'Smartphone', 'Palette', 'Search', 'ShoppingCart', 'Database',
  'Cloud', 'Shield', 'Zap', 'Headphones', 'Globe', 'BarChart', 
  'Camera', 'Megaphone', 'Users', 'Cog', 'Rocket', 'Brain',
  'Mail', 'Video', 'FileText', 'Monitor', 'Cpu', 'Lock',
  'Eye', 'Link', 'Mic', 'Layers', 'MessageSquare', 'Wifi',
  'TrendingUp', 'Accessibility', 'Leaf'
];

const categoryOptions = [
  'Design', 'Development', 'Marketing', 'Infrastructure', 'Security',
  'Optimization', 'Support', 'Analytics', 'Media', 'Content',
  'Maintenance', 'Business', 'AI', 'Innovation', 'Blockchain',
  'IoT', 'Automation', 'Compliance', 'Sustainability'
];

export const ServiceForm = ({ service, onSuccess, onCancel }: ServiceFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ServiceFormData>({
    defaultValues: {
      title: service?.title || '',
      description: service?.description || '',
      icon: service?.icon || 'Code',
      category: service?.category || '',
      price: service?.price || null,
      active: service?.active ?? true,
      featured: service?.featured ?? false,
      sort_order: service?.sort_order || 0,
      button_text: service?.button_text || 'Mehr erfahren',
      service_url: service?.service_url || '',
    }
  });

  const createServiceMutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      const { error } = await supabase
        .from('service_items')
        .insert([{
          ...data,
          price: data.price || null,
          service_url: data.service_url || null,
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Service erfolgreich erstellt');
      onSuccess();
    },
    onError: (error) => {
      console.error('Error creating service:', error);
      toast.error('Fehler beim Erstellen des Services');
    }
  });

  const updateServiceMutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      const { error } = await supabase
        .from('service_items')
        .update({
          ...data,
          price: data.price || null,
          service_url: data.service_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', service!.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Service erfolgreich aktualisiert');
      onSuccess();
    },
    onError: (error) => {
      console.error('Error updating service:', error);
      toast.error('Fehler beim Aktualisieren des Services');
    }
  });

  const onSubmit = async (data: ServiceFormData) => {
    setIsLoading(true);
    try {
      if (service) {
        await updateServiceMutation.mutateAsync(data);
      } else {
        await createServiceMutation.mutateAsync(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
        <h3 className="text-2xl font-bold text-white">
          {service ? 'Service bearbeiten' : 'Neuer Service'}
        </h3>
      </div>

      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="text-white">Service-Details</CardTitle>
          <CardDescription className="text-gray-400">
            {service ? 'Bearbeiten Sie die Service-Informationen' : 'Erstellen Sie einen neuen Service'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">Titel *</Label>
                <Input
                  id="title"
                  {...register('title', { required: 'Titel ist erforderlich' })}
                  className="bg-gray-800/50 border-gray-700 text-white"
                  placeholder="Service-Titel"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-300">Kategorie</Label>
                <Select 
                  value={watch('category')} 
                  onValueChange={(value) => setValue('category', value)}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                    <SelectValue placeholder="Kategorie wählen" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category} className="text-white">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon" className="text-gray-300">Icon</Label>
                <Select 
                  value={watch('icon')} 
                  onValueChange={(value) => setValue('icon', value)}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                    <SelectValue placeholder="Icon wählen" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon} className="text-white">
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-300">Preis (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  className="bg-gray-800/50 border-gray-700 text-white"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort_order" className="text-gray-300">Reihenfolge</Label>
                <Input
                  id="sort_order"
                  type="number"
                  {...register('sort_order', { valueAsNumber: true })}
                  className="bg-gray-800/50 border-gray-700 text-white"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="button_text" className="text-gray-300">Button-Text</Label>
                <Input
                  id="button_text"
                  {...register('button_text')}
                  className="bg-gray-800/50 border-gray-700 text-white"
                  placeholder="Mehr erfahren"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">Beschreibung</Label>
              <Textarea
                id="description"
                {...register('description')}
                className="bg-gray-800/50 border-gray-700 text-white min-h-20"
                placeholder="Service-Beschreibung"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service_url" className="text-gray-300">Service-URL</Label>
              <Input
                id="service_url"
                {...register('service_url')}
                className="bg-gray-800/50 border-gray-700 text-white"
                placeholder="https://example.com/service"
              />
            </div>

            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={watch('active')}
                  onCheckedChange={(checked) => setValue('active', checked)}
                />
                <Label htmlFor="active" className="text-gray-300">Aktiv</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={watch('featured')}
                  onCheckedChange={(checked) => setValue('featured', checked)}
                />
                <Label htmlFor="featured" className="text-gray-300">Featured</Label>
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="modern-button bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Speichert...' : 'Speichern'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="text-gray-400 hover:text-white"
              >
                Abbrechen
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
