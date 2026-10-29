-- ==========================================================================
-- Seashell Customs - Staff Portal database (run whole file in the SQL editor)
-- Idempotent: safe to re-run.
-- ==========================================================================

-- --------------------------------------------------------------------------
-- Tables
-- --------------------------------------------------------------------------
create table if not exists public.staff_profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  discord_name        text,
  discord_avatar_url  text,
  role                text    not null default 'Staff'
                      check (role in ('Staff', 'Manager', 'Admin')),
  is_staff            boolean not null default false,
  created_at          timestamptz not null default now()
);

create table if not exists public.documents (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  category     text not null default 'General',
  description  text,
  url          text not null default '#',
  quick_access boolean not null default false,
  sort_order   int  not null default 0,
  created_by   uuid,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (title)
);

create table if not exists public.agreements (
  id          uuid primary key default gen_random_uuid(),
  title       text   not null,
  description text,
  content     text   not null,
  version     int    not null default 1,
  active      boolean not null default true,
  sort_order  int    not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (title)
);

create table if not exists public.agreement_signatures (
  id                  uuid primary key default gen_random_uuid(),
  agreement_id        uuid not null references public.agreements (id) on delete cascade,
  signed_by           uuid not null references public.staff_profiles (id) on delete cascade,
  agreement_version   int  not null default 1,
  signed_name         text not null,
  signed_at           timestamptz not null default now(),
  unique (agreement_id, signed_by)
);

create table if not exists public.loa_requests (
  id            uuid primary key default gen_random_uuid(),
  requested_by  uuid not null references public.staff_profiles (id) on delete cascade,
  discord_name  text not null,
  type          text not null
                check (type in ('Vacation', 'Illness', 'School / Work', 'Other')),
  start_date    date   not null,
  end_date      date   not null,
  reason        text   not null,
  status        text   not null default 'Pending'
                check (status in ('Pending', 'Approved', 'Denied')),
  review_notes  text,
  reviewed_by   uuid,
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now()
);

create table if not exists public.quick_links (
  id        uuid primary key default gen_random_uuid(),
  label     text   not null,
  href      text   not null,
  icon      text   not null default 'external',
  sort_order int   not null default 0,
  visible   boolean not null default true,
  created_at timestamptz not null default now(),
  unique (label)
);

create index if not exists documents_category_idx on public.documents (category);
create index if not exists loa_requests_requested_by_idx on public.loa_requests (requested_by);
create index if not exists agreement_signatures_agreement_idx on public.agreement_signatures (agreement_id);

-- --------------------------------------------------------------------------
-- Auto profile creation on signup. The very first ever profile becomes Admin
-- (the client should log in first). Everyone after that joins as a non-staff
-- member and must be elevated in Admin > Staff.
-- --------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.staff_profiles (id, discord_name, discord_avatar_url, role, is_staff)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'global_name',
             new.raw_user_meta_data ->> 'user_name',
             new.raw_user_meta_data ->> 'name', 'Staff Member'),
    new.raw_user_meta_data ->> 'avatar_url',
    case
      when not exists (select 1 from public.staff_profiles sp where sp.role = 'Admin')
      then 'Admin' else 'Staff'
    end,
    case
      when not exists (select 1 from public.staff_profiles sp where sp.role = 'Admin')
      then true else false
    end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Keep name/avatar fresh on subsequent logins (Discord metadata refresh)
create or replace function public.handle_user_updated()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.staff_profiles
     set discord_name       = coalesce(new.raw_user_meta_data ->> 'global_name',
                                        new.raw_user_meta_data ->> 'user_name',
                                        new.raw_user_meta_data ->> 'name'),
         discord_avatar_url = new.raw_user_meta_data ->> 'avatar_url'
   where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_user_updated();

-- --------------------------------------------------------------------------
-- Row level security
-- --------------------------------------------------------------------------
alter table public.staff_profiles        enable row level security;
alter table public.documents             enable row level security;
alter table public.agreements            enable row level security;
alter table public.agreement_signatures  enable row level security;
alter table public.loa_requests          enable row level security;
alter table public.quick_links           enable row level security;

-- Reusable predicate fragments: caller is staff / caller is admin
create or replace function public.caller_is_staff() returns boolean
language sql stable security invoker set search_path = ''
as $$
  select exists (
    select 1 from public.staff_profiles
    where id = (select auth.uid()) and is_staff
  );
$$;

create or replace function public.caller_is_admin() returns boolean
language sql stable security invoker set search_path = ''
as $$
  select exists (
    select 1 from public.staff_profiles
    where id = (select auth.uid()) and is_staff and role = 'Admin'
  );
$$;

-- Restrict helper calls to authenticated only
revoke execute on function public.caller_is_staff(), public.caller_is_admin()
  from public, anon;

-- staff_profiles ------------------------------------------------------------
create policy "staff: view own profile" on public.staff_profiles
  for select to authenticated
  using (id = (select auth.uid()));
create policy "staff: roster visible to staff" on public.staff_profiles
  for select to authenticated
  using ((select public.caller_is_staff()));
create policy "staff: update own (role locked)" on public.staff_profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (
    id = (select auth.uid()) and
    role = (select role from public.staff_profiles where id = (select auth.uid()))
  );
create policy "staff: admin manages everyone" on public.staff_profiles
  for update to authenticated
  using ((select public.caller_is_admin()))
  with check ((select public.caller_is_admin()));
create policy "staff: admin can remove" on public.staff_profiles
  for delete to authenticated
  using ((select public.caller_is_admin()));

-- documents -----------------------------------------------------------------
create policy "docs: staff read" on public.documents
  for select to authenticated
  using ((select public.caller_is_staff()));
create policy "docs: admin insert" on public.documents
  for insert to authenticated
  with check ((select public.caller_is_admin()));
create policy "docs: admin update" on public.documents
  for update to authenticated
  using ((select public.caller_is_admin()))
  with check ((select public.caller_is_admin()));
create policy "docs: admin delete" on public.documents
  for delete to authenticated
  using ((select public.caller_is_admin()));

-- agreements ----------------------------------------------------------------
create policy "agreements: staff read" on public.agreements
  for select to authenticated
  using ((select public.caller_is_staff()));
create policy "agreements: admin insert" on public.agreements
  for insert to authenticated
  with check ((select public.caller_is_admin()));
create policy "agreements: admin update" on public.agreements
  for update to authenticated
  using ((select public.caller_is_admin()))
  with check ((select public.caller_is_admin()));
create policy "agreements: admin delete" on public.agreements
  for delete to authenticated
  using ((select public.caller_is_admin()));

-- agreement_signatures ------------------------------------------------------
create policy "signatures: read own" on public.agreement_signatures
  for select to authenticated
  using (signed_by = (select auth.uid()));
create policy "signatures: admin read all" on public.agreement_signatures
  for select to authenticated
  using ((select public.caller_is_admin()));
create policy "signatures: staff sign own" on public.agreement_signatures
  for insert to authenticated
  with check (
    signed_by = (select auth.uid()) and
    signed_name is not null and
    exists (
      select 1 from public.agreements a
      where a.id = agreement_id and a.active
    ) and
    (select public.caller_is_staff())
  );
create policy "signatures: admin reset" on public.agreement_signatures
  for delete to authenticated
  using ((select public.caller_is_admin()));

-- loa_requests --------------------------------------------------------------
create policy "loa: read own" on public.loa_requests
  for select to authenticated
  using (requested_by = (select auth.uid()));
create policy "loa: admin read all" on public.loa_requests
  for select to authenticated
  using ((select public.caller_is_admin()));
create policy "loa: staff submit" on public.loa_requests
  for insert to authenticated
  with check (
    requested_by = (select auth.uid()) and
    (select public.caller_is_staff())
  );
create policy "loa: admin review" on public.loa_requests
  for update to authenticated
  using ((select public.caller_is_admin()))
  with check ((select public.caller_is_admin()));
create policy "loa: staff withdraw own pending" on public.loa_requests
  for delete to authenticated
  using (
    requested_by = (select auth.uid()) and
    status = 'Pending'
  );

-- quick_links ---------------------------------------------------------------
create policy "links: staff read" on public.quick_links
  for select to authenticated
  using ((select public.caller_is_staff()));
create policy "links: admin insert" on public.quick_links
  for insert to authenticated
  with check ((select public.caller_is_admin()));
create policy "links: admin update" on public.quick_links
  for update to authenticated
  using ((select public.caller_is_admin()))
  with check ((select public.caller_is_admin()));
create policy "links: admin delete" on public.quick_links
  for delete to authenticated
  using ((select public.caller_is_admin()));

-- --------------------------------------------------------------------------
-- Seed data
-- --------------------------------------------------------------------------
insert into public.quick_links (label, href, icon, sort_order)
values
  ('Handbooks',      '/dashboard/documents?category=Handbooks', 'book',      0),
  ('Agreements',     '/dashboard/agreements',                    'signature', 1),
  ('Tax Calculator', '/dashboard/tax-calculator',                'calculator',2),
  ('Legal',          '/legal',                                   'scales',    3),
  ('LOA Request',    '/dashboard/loa',                           'calendar',  4)
on conflict do nothing; -- (label only guards duplicates when re-run w/ unique)

insert into public.documents (title, category, description, url, quick_access, sort_order)
values
  ('Staff Handbook', 'Handbooks',
   'The complete Seashell Customs staff handbook - roles, expectations, workflow and pay.',
   'https://example.com/seashell-docs/staff-handbook.pdf', true, 1),
  ('Policies & Procedures', 'Handbooks',
   'Core policies covering our standards, escalation paths and day-to-day procedure.',
   'https://example.com/seashell-docs/policies-procedures.pdf', false, 2),
  ('Staff Code of Conduct', 'Policies',
   'The rules every staff member is expected to follow while representing Seashell Customs.',
   'https://example.com/seashell-docs/code-of-conduct.pdf', true, 3),
  ('Order Form Templates', 'Forms',
   'Ready-to-use templates for premade and custom orders, including revision tracking.',
   'https://example.com/seashell-docs/order-form-templates.pdf', false, 4),
  ('Refund & Revision Policy', 'Policies',
   'How refunds, revisions and additional fees are handled for every service type.',
   'https://example.com/seashell-docs/refund-revision.pdf', false, 5),
  ('Onboarding Guide', 'Guides',
   'Getting started as new staff: Discord access, tools, first tasks and checklists.',
   'https://example.com/seashell-docs/onboarding-guide.pdf', true, 6),
  ('Brand Kit & Templates', 'Guides',
   'Official logos, colors, banners and templates for everything Seashell Customs branded.',
   'https://example.com/seashell-docs/brand-kit.pdf', false, 7)
on conflict do nothing;

insert into public.agreements (title, description, content, sort_order)
values
  ('Seashell Customs Staff Agreement',
   'The core agreement every staff member must read and sign.',
   'By signing below you agree to the following, effective immediately:

1. ROLE & CONDUCT
   You agree to represent Seashell Customs professionally, treat every client
   and teammate with respect, and never engage in harassment, hate speech or
   toxic behaviour while wearing the staff tag.

2. CONFIDENTIALITY
   Anything shared in staff channels (client info, pricing details, unreleased
   projects) stays in staff channels. Do not leak, screenshot or discuss
   confidential material outside the team.

3. WORK AVAILABILITY
   You agree to communicate honestly about your availability and to open an
   LOA (Leave of Absence) request through the Staff Portal before taking
   extended time off.

4. WORKING FOR OTHER DESIGN SERVERS
   Working for competing design commissions must be disclosed to leadership in
   advance. Anything created with Seashell assets stays Seashell property.

5. MEMBERSHIP AT WILL
   Volunteer staff positions may be adjusted, suspended or ended by leadership
   at any time if expectations are not being met.', 0),
  ('Financial Acknowledgement',
   'Covers pay rates and order-flow acknowledgement.',
   'By signing below you acknowledge:

1. PAY RATES
   Commissions are paid at the rates communicated at the time of hand-over.
   Rush services and complex orders may carry additional pay, communicated per
   assignment.

2. PAYMENT PROCESSING
   All client payments are processed through official Seashell Customs
   channels. Staff may never request direct payment from a client.

3. EARNING UPDATES
   You are responsible for checking your earning summary regularly and
   reporting any discrepancies within 7 days.', 1),
  ('Discipline & Escalation Agreement',
   'How issues and disciplinary measures are handled.',
   'By signing below you acknowledge:

1. WARNINGS
   Policy violations may result in a written warning, depending on severity and
   intent. Three active warnings suspend review eligibility.

2. SUSPENSIONS
   Serious violations may result in immediate suspension with no advance
   notice. Suspensions are recorded in staff notes.

3. APPEALS
   Any disciplinary action may be appealed through a senior staff member or the
   owner within 7 days.', 2)
on conflict do nothing;

-- ==========================================================================
-- v2 additions: Discord invites + roster guardrails (idempotent, re-run safe)
-- ==========================================================================

-- --------------------------------------------------------------------------
-- Invite-first roster: Admins add a Discord member by numeric user ID and a
-- chosen role. When that person signs in with Discord for the first time,
-- handle_new_user() (below) upgrades their auto-created profile to the
-- invited role and clears the invite.
-- --------------------------------------------------------------------------
create table if not exists public.pending_invites (
  id               uuid primary key default gen_random_uuid(),
  discord_user_id  text not null unique,
  invitee_name     text,
  role             text not null default 'Staff'
                   check (role in ('Staff', 'Manager', 'Admin')),
  invited_by       uuid,
  created_at       timestamptz not null default now()
);
alter table public.pending_invites enable row level security;

create policy "invites: admin read" on public.pending_invites
  for select to authenticated
  using ((select public.caller_is_admin()));
create policy "invites: admin insert" on public.pending_invites
  for insert to authenticated
  with check ((select public.caller_is_admin()));
create policy "invites: admin delete" on public.pending_invites
  for delete to authenticated
  using ((select public.caller_is_admin()));

-- Re-create the user-creation trigger so it honours pending invites.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  discord_id     text;
  invited_role   text;
  is_first_admin boolean;
begin
  discord_id := coalesce(new.raw_user_meta_data ->> 'provider_id',
                         new.raw_user_meta_data ->> 'sub');

  is_first_admin := not exists (
    select 1 from public.staff_profiles sp where sp.role = 'Admin'
  );

  insert into public.staff_profiles (id, discord_name, discord_avatar_url, role, is_staff)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'global_name',
             new.raw_user_meta_data ->> 'user_name',
             new.raw_user_meta_data ->> 'name', 'Staff Member'),
    new.raw_user_meta_data ->> 'avatar_url',
    case when is_first_admin then 'Admin' else 'Staff' end,
    case when is_first_admin then true else false end
  );

  -- Upgrade invited users to their invited role.
  select role into invited_role
    from public.pending_invites
    where discord_user_id = discord_id;

  if invited_role is not null then
    update public.staff_profiles
       set role = invited_role,
           is_staff = true
     where id = new.id
       and not is_first_admin;

    delete from public.pending_invites
     where discord_user_id = discord_id;
  end if;

  return new;
end;
$$;

-- --------------------------------------------------------------------------
-- Guard: there must always be at least one active Admin on the roster.
-- Blocks both removing the last Admin and demoting/deactivating them.
-- --------------------------------------------------------------------------
create or replace function public.guard_last_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  admins_left int;
begin
  if tg_op = 'DELETE' then
    if old.is_staff and old.role = 'Admin' then
      select count(*) into admins_left
        from public.staff_profiles sp
        where sp.id <> old.id and sp.is_staff and sp.role = 'Admin';
      if admins_left < 1 then
        raise exception 'Cannot remove the last active Admin from the roster.';
      end if;
    end if;
    return old;
  else
    if old.is_staff and old.role = 'Admin'
       and (new.is_staff is not true or new.role is distinct from 'Admin') then
      select count(*) into admins_left
        from public.staff_profiles sp
        where sp.id <> old.id and sp.is_staff and sp.role = 'Admin';
      if admins_left < 1 then
        raise exception 'Cannot demote the last active Admin.';
      end if;
    end if;
    return new;
  end if;
end;
$$;

drop trigger if exists last_admin_guard on public.staff_profiles;
create trigger last_admin_guard
  before update or delete on public.staff_profiles
  for each row execute procedure public.guard_last_admin();
