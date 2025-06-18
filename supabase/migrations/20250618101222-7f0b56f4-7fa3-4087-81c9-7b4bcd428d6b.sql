
-- Füge die priority Spalte zur contact_messages Tabelle hinzu
ALTER TABLE public.contact_messages 
ADD COLUMN priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high'));

-- Setze alle existierenden Nachrichten auf normale Priorität
UPDATE public.contact_messages 
SET priority = 'normal' 
WHERE priority IS NULL;
