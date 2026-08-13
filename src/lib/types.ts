export type TemplateCategory =
  | "Follow-up"
  | "Cold Outreach"
  | "Newsletter"
  | "Announcement"
  | "Other";

export interface EmailTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  subject: string;
  html: string;
  createdAt: string;
  updatedAt: string;
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "Follow-up",
  "Cold Outreach",
  "Newsletter",
  "Announcement",
  "Other",
];
