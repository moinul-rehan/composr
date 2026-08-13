import { EmailTemplate } from "./types";

const STORAGE_KEY = "composr:templates";

function readAll(): EmailTemplate[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as EmailTemplate[];
  } catch {
    return [];
  }
}

function writeAll(templates: EmailTemplate[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function listTemplates(): EmailTemplate[] {
  return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getTemplate(id: string): EmailTemplate | undefined {
  return readAll().find((t) => t.id === id);
}

export function saveTemplate(
  template: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt"> & {
    id?: string;
  }
): EmailTemplate {
  const templates = readAll();
  const now = new Date().toISOString();

  if (template.id) {
    const index = templates.findIndex((t) => t.id === template.id);
    if (index !== -1) {
      const updated: EmailTemplate = {
        ...templates[index],
        ...template,
        id: template.id,
        updatedAt: now,
      };
      templates[index] = updated;
      writeAll(templates);
      return updated;
    }
  }

  const created: EmailTemplate = {
    ...template,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  templates.push(created);
  writeAll(templates);
  return created;
}

export function deleteTemplate(id: string) {
  writeAll(readAll().filter((t) => t.id !== id));
}
