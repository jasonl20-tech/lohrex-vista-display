
-- Add missing columns to projects table
ALTER TABLE public.projects 
ADD COLUMN icon TEXT DEFAULT 'Code',
ADD COLUMN project_url TEXT;

-- Update existing projects to have a default icon
UPDATE public.projects 
SET icon = 'Code' 
WHERE icon IS NULL;
