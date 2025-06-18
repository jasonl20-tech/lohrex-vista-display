
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Navigation } from '@/components/Navigation';
import { 
  User, Settings, Shield, Crown, Star, Heart, Smile, Coffee,
  Camera, Music, Book, Gamepad2, Laptop, Palette, Globe,
  Zap, Rocket, Brain, Eye, Diamond, Flame
} from 'lucide-react';

const availableIcons = [
  { name: 'User', component: User },
  { name: 'Settings', component: Settings },
  { name: 'Shield', component: Shield },
  { name: 'Crown', component: Crown },
  { name: 'Star', component: Star },
  { name: 'Heart', component: Heart },
  { name: 'Smile', component: Smile },
  { name: 'Coffee', component: Coffee },
  { name: 'Camera', component: Camera },
  { name: 'Music', component: Music },
  { name: 'Book', component: Book },
  { name: 'Gamepad2', component: Gamepad2 },
  { name: 'Laptop', component: Laptop },
  { name: 'Palette', component: Palette },
  { name: 'Globe', component: Globe },
  { name: 'Zap', component: Zap },
  { name: 'Rocket', component: Rocket },
  { name: 'Brain', component: Brain },
  { name: 'Eye', component: Eye },
  { name: 'Diamond', component: Diamond },
  { name: 'Flame', component: Flame }
];

const Profile = () => {
  const { user, isAdmin } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [selectedIcon, setSelectedIcon] = useState('User');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setSelectedIcon(data?.avatar_icon || 'User');
    } catch (error) {
      console.error('Fehler beim Laden des Profils:', error);
      toast.error('Fehler beim Laden des Profils');
    } finally {
      setLoading(false);
    }
  };

  const updateAvatar = async (iconName: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_icon: iconName })
        .eq('id', user?.id);

      if (error) throw error;

      setSelectedIcon(iconName);
      setProfile({ ...profile, avatar_icon: iconName });
      toast.success('Profilbild erfolgreich aktualisiert');
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Profilbilds:', error);
      toast.error('Fehler beim Aktualisieren des Profilbilds');
    } finally {
      setUpdating(false);
    }
  };

  const getSelectedIconComponent = () => {
    const iconData = availableIcons.find(icon => icon.name === selectedIcon);
    return iconData ? iconData.component : User;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Card className="modern-card">
            <CardContent className="p-6 text-center">
              <p className="text-white">Bitte melden Sie sich an, um Ihr Profil zu sehen.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  const SelectedIconComponent = getSelectedIconComponent();

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profil Informationen */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2 text-red-400" />
                Profil Informationen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border border-red-500/30">
                  <AvatarFallback className="bg-red-900/30 text-red-400">
                    <SelectedIconComponent className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {profile?.full_name || profile?.email || 'Unbekannter Benutzer'}
                  </h3>
                  <p className="text-gray-400">{profile?.email}</p>
                  {isAdmin && (
                    <Badge variant="secondary" className="mt-1 bg-red-900/20 text-red-400 border-red-500/30">
                      <Shield className="w-3 h-3 mr-1" />
                      Administrator
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Konto Details</h4>
                <div className="space-y-1 text-sm text-gray-400">
                  <p>E-Mail: {profile?.email}</p>
                  <p>Erstellt am: {new Date(profile?.created_at).toLocaleDateString('de-DE')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profilbild Auswahl */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Camera className="w-5 h-5 mr-2 text-red-400" />
                Profilbild auswählen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-3">
                {availableIcons.map((icon) => {
                  const IconComponent = icon.component;
                  const isSelected = selectedIcon === icon.name;
                  
                  return (
                    <button
                      key={icon.name}
                      onClick={() => updateAvatar(icon.name)}
                      disabled={updating}
                      className={`
                        p-3 rounded-lg border transition-all duration-200 
                        ${isSelected 
                          ? 'border-red-500 bg-red-900/20' 
                          : 'border-gray-700 bg-gray-800/50 hover:border-red-500/50 hover:bg-red-900/10'
                        }
                        ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                      title={icon.name}
                    >
                      <IconComponent 
                        className={`h-6 w-6 mx-auto ${
                          isSelected ? 'text-red-400' : 'text-gray-400'
                        }`} 
                      />
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
                <p className="text-sm text-gray-400 text-center">
                  Klicken Sie auf ein Icon, um es als Ihr Profilbild zu verwenden.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
