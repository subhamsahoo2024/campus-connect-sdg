-- ============================================================
-- Allow authenticated users to insert notifications for any user.
-- Required for cross-user notification flows (e.g. mentor → student,
-- student → mentor) used by the mentorship handshake feature.
-- ============================================================

CREATE POLICY "Authenticated users can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
