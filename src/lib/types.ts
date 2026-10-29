export type Profile = {
  id: string;
  discord_name: string | null;
  discord_avatar_url: string | null;
  role: "Staff" | "Manager" | "Admin";
  is_staff: boolean;
  created_at: string;
};

export type DocumentRow = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  url: string;
  quick_access: boolean;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type AgreementRow = {
  id: string;
  title: string;
  description: string | null;
  content: string;
  version: number;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type AgreementSignature = {
  id: string;
  agreement_id: string;
  signed_by: string;
  agreement_version: number;
  signed_name: string;
  signed_at: string;
};

export type LoaRequest = {
  id: string;
  requested_by: string;
  discord_name: string;
  type: "Vacation" | "Illness" | "School / Work" | "Other";
  start_date: string;
  end_date: string;
  reason: string;
  status: "Pending" | "Approved" | "Denied";
  review_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export type PendingInvite = {
  id: string;
  discord_user_id: string;
  invitee_name: string | null;
  role: "Staff" | "Manager" | "Admin";
  invited_by: string | null;
  created_at: string;
};

export type QuickLink = {
  id: string;
  label: string;
  href: string;
  icon: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
};
