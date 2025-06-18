
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, Shield, Search, UserPlus } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  roles: string[];
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Load profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Load user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        roles: userRoles?.filter(ur => ur.user_id === profile.id).map(ur => ur.role) || []
      })) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Fehler beim Laden der Benutzer:', error);
      toast.error('Fehler beim Laden der Benutzer');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: string, action: 'add' | 'remove') => {
    try {
      if (action === 'add') {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', role);
        if (error) throw error;
      }

      await loadUsers();
      toast.success(`Rolle erfolgreich ${action === 'add' ? 'hinzugefügt' : 'entfernt'}`);
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Rolle:', error);
      toast.error('Fehler beim Aktualisieren der Rolle');
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Users className="w-5 h-5 mr-2 text-red-400" />
          Benutzerverwaltung
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Benutzer suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-700 bg-gray-800/50 text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">E-Mail</TableHead>
                <TableHead className="text-gray-300">Name</TableHead>
                <TableHead className="text-gray-300">Rollen</TableHead>
                <TableHead className="text-gray-300">Erstellt</TableHead>
                <TableHead className="text-gray-300">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-gray-700">
                  <TableCell className="text-white">{user.email}</TableCell>
                  <TableCell className="text-white">{user.full_name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge key={role} variant="secondary" className="bg-red-900/20 text-red-400">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(user.created_at).toLocaleDateString('de-DE')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Select onValueChange={(role) => updateUserRole(user.id, role, 'add')}>
                        <SelectTrigger className="w-32 border-gray-700 bg-gray-800/50 text-white">
                          <SelectValue placeholder="Rolle hinzufügen" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                      {user.roles.length > 0 && (
                        <Select onValueChange={(role) => updateUserRole(user.id, role, 'remove')}>
                          <SelectTrigger className="w-32 border-gray-700 bg-gray-800/50 text-white">
                            <SelectValue placeholder="Rolle entfernen" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {user.roles.map((role) => (
                              <SelectItem key={role} value={role}>{role}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
