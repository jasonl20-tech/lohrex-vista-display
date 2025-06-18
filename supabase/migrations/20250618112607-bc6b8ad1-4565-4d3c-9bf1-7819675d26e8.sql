
-- Add avatar_icon column to profiles table to store selected icon
ALTER TABLE public.profiles ADD COLUMN avatar_icon text DEFAULT 'User';

-- Update existing profiles to have a default avatar
UPDATE public.profiles SET avatar_icon = 'User' WHERE avatar_icon IS NULL;
