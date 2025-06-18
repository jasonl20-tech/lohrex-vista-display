
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save, Mail, Phone, MapPin, Clock } from 'lucide-react';

interface ContactSetting {
  key: string;
  value: string;
  label: string;
  icon: any;
  type: 'input' | 'textarea';
}

const contactSettings: ContactSetting[] = [
  { key: 'contact_email', value: '', label: 'E-Mail Adresse', icon: Mail, type: 'input' },
  { key: 'contact_phone', value: '', label: 'Telefonnummer', icon: Phone, type: 'input' },
  { key: 'contact_address', value: '', label: 'Adresse', icon: MapPin, type: 'textarea' },
  { key: 'contact_hours', value: '', label: 'Öffnungszeiten', icon: Clock, type: 'textarea' },
];

export const ContactSettings = () => {
  const [settings, setSettings] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContactSettings();
  }, []);

  const loadContactSettings = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('site_settings')
        .select('key, value')
        .in('key', contactSettings.map(s => s.key));

      if (error) throw error;

      const settingsObj: { [key: string]: string } = {};
      
      // Initialize with default values
      contactSettings.forEach(setting => {
        settingsObj[setting.key] = getDefaultValue(setting.key);
      });

      // Override with database values if they exist
      if (data) {
        data.forEach((item: any) => {
          settingsObj[item.key] = item.value;
        });
      }

      setSettings(settingsObj);
    } catch (error) {
      console.error('Fehler beim Laden der Kontakteinstellungen:', error);
      toast.error('Fehler beim Laden der Kontakteinstellungen');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultValue = (key: string): string => {
    const defaults: { [key: string]: string } = {
      contact_email: 'kontakt@lohrex.de',
      contact_phone: '+49 (0) 123 456 789',
      contact_address: 'Musterstraße 123\n12345 Musterstadt',
      contact_hours: 'Montag - Freitag: 9:00 - 18:00\nSamstag: 10:00 - 14:00'
    };
    return defaults[key] || '';
  };

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const upsertData = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }));

      const { error } = await (supabase as any)
        .from('site_settings')
        .upsert(upsertData);

      if (error) throw error;

      toast.success('Kontakteinstellungen erfolgreich gespeichert!');
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      toast.error('Fehler beim Speichern der Kontakteinstellungen');
    } finally {
      setSaving(false);
    }
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
        <CardTitle className="flex items-center text-white">
          <Phone className="w-5 h-5 mr-2 text-red-400" />
          Kontaktdaten verwalten
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {contactSettings.map((setting) => {
          const IconComponent = setting.icon;
          return (
            <div key={setting.key} className="space-y-2">
              <Label htmlFor={setting.key} className="text-gray-300 flex items-center">
                <IconComponent className="w-4 h-4 mr-2 text-red-400" />
                {setting.label}
              </Label>
              {setting.type === 'input' ? (
                <Input
                  id={setting.key}
                  value={settings[setting.key] || ''}
                  onChange={(e) => handleInputChange(setting.key, e.target.value)}
                  className="border-gray-700 bg-gray-800/50 text-white focus:border-red-500 focus:ring-red-500"
                />
              ) : (
                <Textarea
                  id={setting.key}
                  value={settings[setting.key] || ''}
                  onChange={(e) => handleInputChange(setting.key, e.target.value)}
                  rows={3}
                  className="border-gray-700 bg-gray-800/50 text-white focus:border-red-500 focus:ring-red-500"
                />
              )}
            </div>
          );
        })}

        <Button
          onClick={saveSettings}
          disabled={saving}
          className="w-full modern-button bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Speichere...' : 'Kontaktdaten speichern'}
        </Button>
      </CardContent>
    </Card>
  );
};
