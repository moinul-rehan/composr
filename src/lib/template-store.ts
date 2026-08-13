import { EmailTemplate } from "./types";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed with ${response.status}`);
  }
  return response.json();
}

export async function listTemplates(): Promise<EmailTemplate[]> {
  const response = await fetch("/api/templates");
  return handleResponse<EmailTemplate[]>(response);
}

export async function getTemplate(id: string): Promise<EmailTemplate | undefined> {
  const response = await fetch(`/api/templates/${id}`);
  if (response.status === 404) return undefined;
  return handleResponse<EmailTemplate>(response);
}

export async function saveTemplate(
  template: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt"> & {
    id?: string;
  }
): Promise<EmailTemplate> {
  const { id, ...rest } = template;

  const response = id
    ? await fetch(`/api/templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      })
    : await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });

  return handleResponse<EmailTemplate>(response);
}

export async function deleteTemplate(id: string): Promise<void> {
  const response = await fetch(`/api/templates/${id}`, { method: "DELETE" });
  await handleResponse<{ ok: boolean }>(response);
}

export async function sendTemplateToGmail(id: string): Promise<{ draftId: string }> {
  const response = await fetch(`/api/templates/${id}/send-to-gmail`, {
    method: "POST",
  });
  return handleResponse<{ draftId: string }>(response);
}
