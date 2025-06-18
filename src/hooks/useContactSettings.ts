
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ContactData {
  email: string;
  phone: string;
  address: string;
  hours: string;
}

const defaultContactData: ContactData = {
  email: 'kontakt@lohrex.de',
  phone: '+49 (0) 123 456 789',
  address: 'Musterstraße 123\n12345 Musterstadt',
  hours: 'Montag - Freitag: 9:00 - 18:00\nSamstag: 10:00 - 14:00'
};

export const useContactSettings = () => {
  const [contactData, setContactData] = useState<ContactData>(defaultContactData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContactSettings();
  }, []);

  const loadContactSettings = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('site_settings')
        .select('key, value')
        .in('key', ['contact_email', 'contact_phone', 'contact_address', 'contact_hours']);

      if (error) throw error;

      const newContactData = { ...defaultContactData };

      if (data) {
        data.forEach((item: any) => {
          switch (item.key) {
            case 'contact_email':
              newContactData.email = item.value;
              break;
            case 'contact_phone':
              newContactData.phone = item.value;
              break;
            case 'contact_address':
              newContactData.address = item.value;
              break;
            case 'contact_hours':
              newContactData.hours = item.value;
              break;
          }
        });
      }

      setContactData(newContactData);
    } catch (error) {
      console.error('Fehler beim Laden der Kontaktdaten:', error);
      // Fallback zu Standard-Werten bei Fehler
      setContactData(defaultContactData);
    } finally {
      setLoading(false);
    }
  };

  return { contactData, loading, refreshContactData: loadContactSettings };
};
