
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { Palette } from 'lucide-react';

export const ThemeSettings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Palette className="w-5 h-5 mr-2 text-red-400" />
            Website Design
          </CardTitle>
          <CardDescription className="text-gray-400">
            Wählen Sie das Farbschema für Ihre Website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={theme} onValueChange={(value: string) => setTheme(value as 'red' | 'silver')}>
            <div className="space-y-4">
              {/* Red Theme Option */}
              <div className="flex items-center space-x-3 p-4 border border-gray-700 rounded-lg hover:border-red-500/50 transition-colors">
                <RadioGroupItem value="red" id="red-theme" />
                <Label htmlFor="red-theme" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Rot Design</div>
                      <div className="text-sm text-gray-400">Aktuelles rotes Farbschema mit modernen Lava-Effekten</div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white/20"></div>
                      <div className="w-6 h-6 bg-red-700 rounded-full border-2 border-white/20"></div>
                      <div className="w-6 h-6 bg-black rounded-full border-2 border-white/20"></div>
                    </div>
                  </div>
                </Label>
              </div>

              {/* Silver Theme Option */}
              <div className="flex items-center space-x-3 p-4 border border-gray-700 rounded-lg hover:border-gray-400 transition-colors">
                <RadioGroupItem value="silver" id="silver-theme" />
                <Label htmlFor="silver-theme" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Weiß-Silber Design</div>
                      <div className="text-sm text-gray-400">Elegantes helles Design mit silbernen Akzenten</div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-6 h-6 bg-white rounded-full border-2 border-gray-300"></div>
                      <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-gray-300"></div>
                      <div className="w-6 h-6 bg-gray-600 rounded-full border-2 border-gray-300"></div>
                    </div>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>

          <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300">
              <strong>Hinweis:</strong> Die Änderung wird sofort auf der gesamten Website angewendet. 
              Ihre Auswahl wird automatisch gespeichert.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
