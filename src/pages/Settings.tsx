
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Navigation } from '@/components/Navigation';
import { Settings as SettingsIcon, Mail, Lock, Save, AlertTriangle } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    password: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const updateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.newEmail || !emailForm.password) {
      toast.error('Bitte füllen Sie alle Felder aus');
      return;
    }

    setEmailLoading(true);
    try {
      // Verify current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: emailForm.password
      });

      if (signInError) {
        toast.error('Aktuelles Passwort ist falsch');
        return;
      }

      // Update email
      const { error } = await supabase.auth.updateUser({
        email: emailForm.newEmail
      });

      if (error) throw error;

      toast.success('E-Mail erfolgreich aktualisiert. Bitte überprüfen Sie Ihr Postfach zur Bestätigung.');
      setEmailForm({ newEmail: '', password: '' });
    } catch (error: any) {
      console.error('Fehler beim Aktualisieren der E-Mail:', error);
      toast.error(error.message || 'Fehler beim Aktualisieren der E-Mail');
    } finally {
      setEmailLoading(false);
    }
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Bitte füllen Sie alle Felder aus');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Neue Passwörter stimmen nicht überein');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Das neue Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    setPasswordLoading(true);
    try {
      // Verify current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: passwordForm.currentPassword
      });

      if (signInError) {
        toast.error('Aktuelles Passwort ist falsch');
        return;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      toast.success('Passwort erfolgreich aktualisiert');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Fehler beim Aktualisieren des Passworts:', error);
      toast.error(error.message || 'Fehler beim Aktualisieren des Passworts');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Card className="modern-card">
            <CardContent className="p-6 text-center">
              <p className="text-white">Bitte melden Sie sich an, um auf die Einstellungen zuzugreifen.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Einstellungen</h1>
            <p className="text-gray-400">Verwalten Sie Ihre Konto-Einstellungen</p>
          </div>

          {/* E-Mail ändern */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Mail className="w-5 h-5 mr-2 text-red-400" />
                E-Mail-Adresse ändern
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateEmail} className="space-y-4">
                <div>
                  <Label htmlFor="currentEmail" className="text-gray-300">
                    Aktuelle E-Mail
                  </Label>
                  <Input
                    id="currentEmail"
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="border-gray-700 bg-gray-800/50 text-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="newEmail" className="text-gray-300">
                    Neue E-Mail-Adresse
                  </Label>
                  <Input
                    id="newEmail"
                    type="email"
                    value={emailForm.newEmail}
                    onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                    className="border-gray-700 bg-gray-800/50 text-white"
                    placeholder="neue@email.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="emailPassword" className="text-gray-300">
                    Aktuelles Passwort zur Bestätigung
                  </Label>
                  <Input
                    id="emailPassword"
                    type="password"
                    value={emailForm.password}
                    onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                    className="border-gray-700 bg-gray-800/50 text-white"
                    placeholder="Ihr aktuelles Passwort"
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <p className="text-sm text-yellow-300">
                    Sie erhalten eine Bestätigungs-E-Mail an die neue Adresse.
                  </p>
                </div>
                
                <Button
                  type="submit"
                  disabled={emailLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  {emailLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Wird aktualisiert...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      E-Mail aktualisieren
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Separator className="bg-gray-700" />

          {/* Passwort ändern */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Lock className="w-5 h-5 mr-2 text-red-400" />
                Passwort ändern
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={updatePassword} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword" className="text-gray-300">
                    Aktuelles Passwort
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="border-gray-700 bg-gray-800/50 text-white"
                    placeholder="Ihr aktuelles Passwort"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="newPassword" className="text-gray-300">
                    Neues Passwort
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="border-gray-700 bg-gray-800/50 text-white"
                    placeholder="Neues Passwort (mindestens 6 Zeichen)"
                    required
                    minLength={6}
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-300">
                    Neues Passwort bestätigen
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="border-gray-700 bg-gray-800/50 text-white"
                    placeholder="Neues Passwort wiederholen"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  {passwordLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Wird aktualisiert...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      Passwort aktualisieren
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
