
-- Create a table for managing services
CREATE TABLE public.service_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Code',
  category TEXT,
  price NUMERIC,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  button_text TEXT DEFAULT 'Mehr erfahren',
  service_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default services data
INSERT INTO public.service_items (title, description, icon, category, active, featured, sort_order, button_text) VALUES
('Webdesign', 'Moderne und ansprechende Website-Designs', 'Palette', 'Design', true, true, 1, 'Mehr erfahren'),
('Webentwicklung', 'Professionelle Website-Entwicklung', 'Code', 'Development', true, true, 2, 'Mehr erfahren'),
('App-Entwicklung', 'Mobile Apps für iOS und Android', 'Smartphone', 'Development', true, true, 3, 'Mehr erfahren'),
('SEO Optimierung', 'Suchmaschinenoptimierung für bessere Rankings', 'Search', 'Marketing', true, false, 4, 'Mehr erfahren'),
('E-Commerce', 'Online-Shops und Verkaufsplattformen', 'ShoppingCart', 'Development', true, false, 5, 'Mehr erfahren'),
('Datenbank-Design', 'Effiziente Datenbanklösungen', 'Database', 'Development', true, false, 6, 'Mehr erfahren'),
('Cloud Services', 'Cloud-basierte Lösungen und Migration', 'Cloud', 'Infrastructure', true, false, 7, 'Mehr erfahren'),
('Cybersecurity', 'Sicherheitslösungen für Ihr Unternehmen', 'Shield', 'Security', true, false, 8, 'Mehr erfahren'),
('Performance-Optimierung', 'Website-Geschwindigkeit optimieren', 'Zap', 'Optimization', true, false, 9, 'Mehr erfahren'),
('Technical Support', '24/7 technischer Support', 'Headphones', 'Support', true, false, 10, 'Mehr erfahren'),
('Web Hosting', 'Zuverlässige Hosting-Lösungen', 'Globe', 'Infrastructure', true, false, 11, 'Mehr erfahren'),
('Web Analytics', 'Datenanalyse und Reporting', 'BarChart', 'Analytics', true, false, 12, 'Mehr erfahren'),
('Web-Fotografie', 'Professionelle Fotos für Websites', 'Camera', 'Media', true, false, 13, 'Mehr erfahren'),
('Digital Marketing', 'Online-Marketing-Strategien', 'Megaphone', 'Marketing', true, false, 14, 'Mehr erfahren'),
('Social Media', 'Social Media Management', 'Users', 'Marketing', true, false, 15, 'Mehr erfahren'),
('Website-Wartung', 'Regelmäßige Updates und Pflege', 'Cog', 'Maintenance', true, false, 16, 'Mehr erfahren'),
('Startup-Lösungen', 'Komplettlösungen für Startups', 'Rocket', 'Business', true, false, 17, 'Mehr erfahren'),
('KI-Integration', 'Künstliche Intelligenz implementieren', 'Brain', 'AI', true, false, 18, 'Mehr erfahren'),
('E-Mail Marketing', 'Professionelle E-Mail-Kampagnen', 'Mail', 'Marketing', true, false, 19, 'Mehr erfahren'),
('Video Content', 'Videoproduktion für Web', 'Video', 'Media', true, false, 20, 'Mehr erfahren'),
('Content Management', 'CMS-Lösungen und Content-Strategie', 'FileText', 'Content', true, false, 21, 'Mehr erfahren'),
('Responsive Design', 'Mobile-optimierte Websites', 'Monitor', 'Design', true, false, 22, 'Mehr erfahren'),
('API-Entwicklung', 'Schnittstellen und API-Services', 'Cpu', 'Development', true, false, 23, 'Mehr erfahren'),
('SSL & Sicherheit', 'Website-Verschlüsselung und Sicherheit', 'Lock', 'Security', true, false, 24, 'Mehr erfahren'),
-- 10 neue innovative Service-Ideen
('AR/VR Entwicklung', 'Augmented und Virtual Reality Anwendungen', 'Eye', 'Innovation', true, false, 25, 'Entdecken'),
('Blockchain Integration', 'Dezentrale Lösungen und Smart Contracts', 'Link', 'Blockchain', true, false, 26, 'Mehr erfahren'),
('Voice UI Development', 'Sprachgesteuerte Benutzeroberflächen', 'Mic', 'AI', true, false, 27, 'Ausprobieren'),
('Progressive Web Apps', 'App-ähnliche Web-Erlebnisse', 'Layers', 'Development', true, false, 28, 'Mehr erfahren'),
('Chatbot Development', 'Intelligente Kundenservice-Bots', 'MessageSquare', 'AI', true, false, 29, 'Demo ansehen'),
('IoT Solutions', 'Internet der Dinge Implementierungen', 'Wifi', 'IoT', true, false, 30, 'Mehr erfahren'),
('Automation Services', 'Geschäftsprozess-Automatisierung', 'Zap', 'Automation', true, false, 31, 'Automatisieren'),
('Data Visualization', 'Interaktive Datenvisualisierung', 'TrendingUp', 'Analytics', true, false, 32, 'Visualisieren'),
('Accessibility Audit', 'Barrierefreiheits-Optimierung', 'Accessibility', 'Compliance', true, false, 33, 'Prüfen lassen'),
('Green Tech Solutions', 'Nachhaltige und energieeffiziente Lösungen', 'Leaf', 'Sustainability', true, false, 34, 'Nachhaltigkeit');

-- Add RLS policies (optional - services can be public)
ALTER TABLE public.service_items ENABLE ROW LEVEL SECURITY;

-- Policy to allow everyone to read services
CREATE POLICY "Anyone can view active services" 
  ON public.service_items 
  FOR SELECT 
  USING (active = true);

-- Policy to allow admins to manage services  
CREATE POLICY "Admins can manage services" 
  ON public.service_items 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );
