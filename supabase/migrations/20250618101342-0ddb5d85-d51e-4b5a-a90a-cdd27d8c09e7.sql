
-- RLS Policy für das Löschen von Kontaktnachrichten durch Admins hinzufügen
CREATE POLICY "Admins can delete contact messages" 
  ON public.contact_messages 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
