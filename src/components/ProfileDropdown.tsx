
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, Settings, Shield, LogOut, ChevronDown, LayoutDashboard,
  Crown, Star, Heart, Smile, Coffee, Camera, Music, Book,
  Gamepad2, Laptop, Palette, Globe, Zap, Rocket, Brain,
  Eye, Diamond, Flame
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const iconMap = {
  User, Settings, Shield, Crown, Star, Heart, Smile, Coffee,
  Camera, Music, Book, Gamepad2, Laptop, Palette, Globe,
  Zap, Rocket, Brain, Eye, Diamond, Flame
};

export const ProfileDropdown = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch user profile for avatar icon
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_icon')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  if (!user) {
    return (
      <Button
        onClick={() => navigate('/auth')}
        className="modern-button-outline border-red-500/30 text-red-400 hover:bg-red-900/20"
      >
        Admin Login
      </Button>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Erfolgreich abgemeldet');
      navigate('/');
    } catch (error) {
      toast.error('Fehler beim Abmelden');
    }
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const getAvatarIcon = () => {
    const iconName = profile?.avatar_icon || 'User';
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || User;
    return IconComponent;
  };

  const AvatarIcon = getAvatarIcon();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 h-10 px-3 modern-button-outline border-red-500/20 hover:border-red-500/40 hover:bg-red-900/10"
        >
          <Avatar className="h-8 w-8 border border-red-500/30">
            <AvatarFallback className="bg-red-900/30 text-red-400 text-xs font-semibold">
              <AvatarIcon className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-white truncate max-w-32">
              {user.email}
            </span>
            {isAdmin && (
              <Badge variant="secondary" className="text-xs bg-red-900/20 text-red-400 border-red-500/30">
                Admin
              </Badge>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-black/95 backdrop-blur-xl border-red-900/30 shadow-2xl"
      >
        <DropdownMenuLabel className="text-gray-300">
          <div className="flex items-center space-x-2">
            <Avatar className="h-10 w-10 border border-red-500/30">
              <AvatarFallback className="bg-red-900/30 text-red-400 font-semibold">
                <AvatarIcon className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-white">{user.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                {isAdmin && (
                  <Badge variant="secondary" className="text-xs bg-red-900/20 text-red-400 border-red-500/30">
                    <Shield className="w-3 h-3 mr-1" />
                    Administrator
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-red-900/20" />
        
        <DropdownMenuItem 
          className="text-gray-300 hover:bg-red-900/20 hover:text-white cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          <User className="mr-2 h-4 w-4" />
          Profil
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="text-gray-300 hover:bg-red-900/20 hover:text-white cursor-pointer"
          onClick={() => navigate('/settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          Einstellungen
        </DropdownMenuItem>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator className="bg-red-900/20" />
            <DropdownMenuItem 
              className="text-red-400 hover:bg-red-900/20 hover:text-red-300 cursor-pointer"
              onClick={() => navigate('/admin')}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator className="bg-red-900/20" />
        
        <DropdownMenuItem 
          className="text-gray-300 hover:bg-red-900/20 hover:text-white cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Abmelden
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
