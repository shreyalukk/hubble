-- RBAC Policies for Admins

-- Only admins can delete users
create policy "Admins can delete users"
on users for delete
using (
  (select role from users where id = auth.uid()) = 'admin'
);

-- Only admins can delete hubs
create policy "Admins can delete hubs"
on hubs for delete
using (
  (select role from users where id = auth.uid()) = 'admin'
);

-- Admins can update any user's role
create policy "Admins can update users"
on users for update
using (
  (select role from users where id = auth.uid()) = 'admin'
);
