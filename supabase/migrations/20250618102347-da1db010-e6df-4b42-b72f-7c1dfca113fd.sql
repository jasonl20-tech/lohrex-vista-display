
-- Create a table for site settings
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the table
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read site settings (global theme should be visible to all)
CREATE POLICY "Anyone can read site settings" 
  ON public.site_settings 
  FOR SELECT 
  USING (true);

-- Create policy to allow only authenticated users to modify site settings
CREATE POLICY "Authenticated users can modify site settings" 
  ON public.site_settings 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Insert default theme setting
INSERT INTO public.site_settings (key, value) 
VALUES ('global_theme', 'red') 
ON CONFLICT (key) DO NOTHING;
