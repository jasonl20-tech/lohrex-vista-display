
-- Erweitere admin_notes Tabelle falls noch nicht alle Felder vorhanden sind
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_notes' AND column_name='created_by') THEN
        ALTER TABLE admin_notes ADD COLUMN created_by UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- RLS Policies für admin_notes (nur Admins können zugreifen)
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage all notes" ON admin_notes;
CREATE POLICY "Admins can manage all notes" ON admin_notes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies für tasks (nur Admins können zugreifen)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage all tasks" ON tasks;
CREATE POLICY "Admins can manage all tasks" ON tasks
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies für transactions (nur Admins können zugreifen)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage all transactions" ON transactions;
CREATE POLICY "Admins can manage all transactions" ON transactions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies für invoices (nur Admins können zugreifen)
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage all invoices" ON invoices;
CREATE POLICY "Admins can manage all invoices" ON invoices
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies für backups (nur Admins können zugreifen)
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage all backups" ON backups;
CREATE POLICY "Admins can manage all backups" ON backups
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies für email_campaigns (nur Admins können zugreifen)
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage all campaigns" ON email_campaigns;
CREATE POLICY "Admins can manage all campaigns" ON email_campaigns
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies für file_manager (nur Admins können zugreifen)
ALTER TABLE file_manager ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage all files" ON file_manager;
CREATE POLICY "Admins can manage all files" ON file_manager
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies für system_logs (nur Admins können lesen)
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read all logs" ON system_logs;
CREATE POLICY "Admins can read all logs" ON system_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
