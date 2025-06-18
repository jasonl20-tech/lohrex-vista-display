
-- Stelle sicher, dass RLS für user_roles aktiviert ist
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Erstelle RLS-Richtlinien für user_roles
CREATE POLICY "Admins can view all user roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage user roles" 
  ON public.user_roles 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Stelle sicher, dass RLS für profiles aktiviert ist
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Erstelle RLS-Richtlinien für profiles
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can update all profiles" 
  ON public.profiles 
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

-- Erstelle einen ersten Admin-Benutzer (wird nach der ersten Anmeldung funktionieren)
-- Diese Funktion wird ausgeführt, wenn sich der erste Benutzer anmeldet
CREATE OR REPLACE FUNCTION public.setup_first_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Mache lohrejason5@gmail.com zum Admin
  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'admin'::app_role
  FROM auth.users
  WHERE email = 'lohrejason5@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.users.id AND role = 'admin'
  );
  
  -- Fallback: Wenn noch keine Admin-Rollen existieren, mache den ersten Benutzer zum Admin
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    SELECT id, 'admin'::app_role
    FROM auth.users
    ORDER BY created_at
    LIMIT 1;
  END IF;
END;
$$;
