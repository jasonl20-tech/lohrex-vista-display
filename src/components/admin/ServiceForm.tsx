
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { X } from 'lucide-react';

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
  onClose: () => void;
  onSuccess: () => void;
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
  'Optimization', 'Support', 'Analytics', 'Media', 'Business', 
  'AI', 'Content', 'Innovation', 'Blockchain', 'IoT', 'Automation',
  'Compliance', 'Sustainability'
];

export const ServiceForm: React.FC<ServiceFormProps> = ({ service, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Code',
    category: 'Development',
    price: '',
    active: true,
    featured: false,
    sort_order: 0,
    button_text: 'Mehr erfahren',
    service_url: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        description: service.description,
        icon: service.icon,
        category: service.category,
        price: service.price?.toString() || '',
        active: service.active,
        featured: service.featured,
        sort_order: service.sort_order,
        button_text: service.button_text,
        service_url: service.service_url || ''
      });
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const serviceData = {
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
        category: formData.category,
        price: formData.price ? parseFloat(formData.price) : null,
        active: formData.active,
        featured: formData.featured,
        sort_order: formData.sort_order,
        button_text: formData.button_text,
        service_url: formData.service_url || null,
        updated_at: new Date().toISOString()
      };

      if (service) {
        // Update existing service
        const { error } = await supabase
          .from('service_items')
          .update(serviceData)
          .eq('id', service.id);
        
        if (error) throw error;
        toast.success('Service aktualisiert');
      } else {
        // Create new service
        const { error } = await supabase
          .from('service_items')
          .insert(serviceData);
        
        if (error) throw error;
        toast.success('Service erstellt');
      }

      onSuccess();
    } catch (error: any) {
      toast.error('Fehler: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="modern-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">
              {service ? 'Service bearbeiten' : 'Neuer Service'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">Titel</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="modern-input"
                  required
                />
              </div>
              <div>
                <Label htmlFor="button_text" className="text-gray-300">Button Text</Label>
                <Input
                  id="button_text"
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  className="modern-input"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-300">Beschreibung</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="modern-input"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="icon" className="text-gray-300">Icon</Label>
                <Select 
                  value={formData.icon} 
                  onValueChange={(value) => setFormData({ ...formData, icon: value })}
                >
                  <SelectTrigger className="modern-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon} className="text-white hover:bg-gray-800">
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category" className="text-gray-300">Kategorie</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="modern-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category} className="text-white hover:bg-gray-800">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-gray-300">Preis (optional)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="modern-input"
                  placeholder="z.B. 299.99"
                />
              </div>
              <div>
                <Label htmlFor="sort_order" className="text-gray-300">Reihenfolge</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                  className="modern-input"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="service_url" className="text-gray-300">Service URL (optional)</Label>
              <Input
                id="service_url"
                type="url"
                value={formData.service_url}
                onChange={(e) => setFormData({ ...formData, service_url: e.target.value })}
                className="modern-input"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="active" className="text-gray-300">Aktiv</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured" className="text-gray-300">Featured</Label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="modern-button bg-gradient-to-r from-red-600 to-red-700"
              >
                {loading ? 'Speichern...' : (service ? 'Aktualisieren' : 'Erstellen')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-600 text-gray-300"
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
