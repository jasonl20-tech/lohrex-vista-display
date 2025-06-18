
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
import { User, Settings, Shield, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const ProfileDropdown = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 h-10 px-3 modern-button-outline border-red-500/20 hover:border-red-500/40 hover:bg-red-900/10"
        >
          <Avatar className="h-8 w-8 border border-red-500/30">
            <AvatarFallback className="bg-red-900/30 text-red-400 text-xs font-semibold">
              {getInitials(user.email || 'U')}
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
                {getInitials(user.email || 'U')}
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
          onClick={() => toast.info('Profil-Einstellungen werden bald verfügbar sein')}
        >
          <User className="mr-2 h-4 w-4" />
          Profil
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="text-gray-300 hover:bg-red-900/20 hover:text-white cursor-pointer"
          onClick={() => toast.info('Einstellungen werden bald verfügbar sein')}
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
