
-- Tabelle für Kontaktnachrichten
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabelle für anpassbare Seiteninhalte (Datenschutz/Impressum)
CREATE TABLE public.page_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS für contact_messages (nur Admins können alle Nachrichten sehen)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all contact messages" 
  ON public.contact_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Anyone can insert contact messages" 
  ON public.contact_messages 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can update contact messages" 
  ON public.contact_messages 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS für page_content (nur Admins können bearbeiten, alle können lesen)
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view page content" 
  ON public.page_content 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage page content" 
  ON public.page_content 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Standardinhalte für Datenschutz und Impressum einfügen
INSERT INTO public.page_content (page_key, title, content) VALUES 
('datenschutz', 'Datenschutzerklärung', 'Hier steht Ihre Datenschutzerklärung. Dieser Inhalt kann über das Admin-Tool bearbeitet werden.'),
('impressum', 'Impressum', 'Hier steht Ihr Impressum. Dieser Inhalt kann über das Admin-Tool bearbeitet werden.');

-- Realtime für contact_messages aktivieren
ALTER TABLE public.contact_messages REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.contact_messages;
