
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { Palette } from 'lucide-react';

const themeOptions = [
  {
    id: 'red',
    name: 'Rot Design',
    description: 'Kraftvolles rotes Design mit Lava-Effekten',
    colors: ['#ef4444', '#dc2626', '#000000']
  },
  {
    id: 'silver',
    name: 'Silber Design',
    description: 'Elegantes helles Design mit silbernen Akzenten',
    colors: ['#ffffff', '#d1d5db', '#6b7280']
  },
  {
    id: 'blue',
    name: 'Ozean Blau',
    description: 'Tiefes Blau mit modernen Akzenten',
    colors: ['#3b82f6', '#1d4ed8', '#1e293b']
  },
  {
    id: 'purple',
    name: 'Royal Lila',
    description: 'Luxuriöses Lila mit mystischen Tönen',
    colors: ['#8b5cf6', '#7c3aed', '#1e1b4b']
  },
  {
    id: 'green',
    name: 'Natur Grün',
    description: 'Frisches Grün mit natürlichen Akzenten',
    colors: ['#10b981', '#059669', '#064e3b']
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    description: 'Warmes Orange mit Sonnenuntergang-Feeling',
    colors: ['#f97316', '#ea580c', '#9a3412']
  },
  {
    id: 'pink',
    name: 'Cherry Blossom',
    description: 'Zartes Rosa mit eleganten Tönen',
    colors: ['#ec4899', '#db2777', '#831843']
  },
  {
    id: 'cyan',
    name: 'Crystal Cyan',
    description: 'Kristallklares Cyan mit frischen Akzenten',
    colors: ['#06b6d4', '#0891b2', '#164e63']
  },
  {
    id: 'amber',
    name: 'Golden Amber',
    description: 'Warmes Gold mit luxuriösen Tönen',
    colors: ['#f59e0b', '#d97706', '#92400e']
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    description: 'Tiefes Smaragdgrün mit Waldfeeling',
    colors: ['#10b981', '#059669', '#064e3b']
  },
  {
    id: 'indigo',
    name: 'Midnight Indigo',
    description: 'Tiefes Indigo mit nächtlicher Eleganz',
    colors: ['#6366f1', '#4f46e5', '#312e81']
  },
  {
    id: 'rose',
    name: 'Rose Gold',
    description: 'Elegantes Roségold mit warmen Tönen',
    colors: ['#f43f5e', '#e11d48', '#881337']
  }
];

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
            Wählen Sie das Farbschema für Ihre Website aus 12 verfügbaren Designs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup 
            value={theme} 
            onValueChange={(value) => setTheme(value as any)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {themeOptions.map((option) => (
              <div 
                key={option.id}
                className="flex items-center space-x-3 p-4 border border-gray-700 rounded-lg hover:border-opacity-80 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  borderColor: theme === option.id ? option.colors[0] + '80' : undefined,
                  backgroundColor: theme === option.id ? option.colors[0] + '10' : undefined
                }}
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-white mb-1">{option.name}</div>
                      <div className="text-sm text-gray-400">{option.description}</div>
                    </div>
                    <div className="flex space-x-1 ml-4">
                      {option.colors.map((color, index) => (
                        <div 
                          key={index}
                          className="w-6 h-6 rounded-full border-2 border-white/20"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300">
              <strong>Hinweis:</strong> Die Änderung wird sofort auf der gesamten Website angewendet. 
              Ihre Auswahl wird automatisch gespeichert und alle Animationen und Effekte werden entsprechend angepasst.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
