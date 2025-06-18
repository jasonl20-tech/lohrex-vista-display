
-- Stelle sicher, dass lohrejason5@gmail.com Admin-Rechte hat
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'lohrejason5@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.users.id AND role = 'admin'
);

-- Führe die setup_first_admin Funktion manuell aus
SELECT public.setup_first_admin();
