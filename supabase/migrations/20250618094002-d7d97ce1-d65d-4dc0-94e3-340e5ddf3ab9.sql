
-- Erstelle eine Tabelle für Projekte
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'Planung',
  category TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Füge Row Level Security hinzu (nur Admins können Projekte verwalten)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Jeder kann Projekte sehen (für die öffentliche Website)
CREATE POLICY "Anyone can view active projects" 
  ON public.projects 
  FOR SELECT 
  USING (active = true);

-- Nur Admins können Projekte erstellen, bearbeiten und löschen
CREATE POLICY "Admins can manage projects" 
  ON public.projects 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Füge einige Beispielprojekte hinzu
INSERT INTO public.projects (title, description, tags, status, image_url, category) VALUES 
(
  'E-Commerce Platform',
  'Vollständige E-Commerce-Lösung mit modernem Design und erweiterten Funktionen für Online-Händler.',
  ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'],
  'Abgeschlossen',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
  'Web Development'
),
(
  'Mobile App Suite',
  'Cross-Platform Mobile App für iOS und Android mit Cloud-Integration und Real-time Features.',
  ARRAY['React Native', 'Firebase', 'TypeScript', 'Redux'],
  'In Entwicklung',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
  'Mobile Development'
),
(
  'Data Analytics Dashboard',
  'Interaktives Dashboard für Business Intelligence mit Echtzeitdaten und erweiterten Visualisierungen.',
  ARRAY['Python', 'React', 'D3.js', 'MongoDB'],
  'Abgeschlossen',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
  'Data Science'
);
