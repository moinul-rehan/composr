"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmailTemplate, TEMPLATE_CATEGORIES, TemplateCategory } from "@/lib/types";
import { deleteTemplate, saveTemplate } from "@/lib/template-store";
import CopyButton from "@/components/CopyButton";

export default function TemplateEditor({
  existing,
}: {
  existing?: EmailTemplate;
}) {
  const router = useRouter();
  const [name, setName] = useState(existing?.name ?? "");
  const [subject, setSubject] = useState(existing?.subject ?? "");
  const [category, setCategory] = useState<TemplateCategory>(
    existing?.category ?? "Follow-up"
  );
  const [html, setHtml] = useState(existing?.html ?? "");
  const [tab, setTab] = useState<"code" | "preview">("code");

  function handleSave() {
    if (!name.trim() || !html.trim()) return;
    saveTemplate({ id: existing?.id, name, subject, category, html });
    router.push("/");
  }

  function handleDelete() {
    if (!existing) return;
    if (!confirm(`Delete "${existing.name}"? This can't be undone.`)) return;
    deleteTemplate(existing.id);
    router.push("/");
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-sm font-semibold text-neutral-900">Details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Template name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Follow-up after no reply"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
            />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TemplateCategory)}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
            >
              {TEMPLATE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-neutral-700">
              Default subject line{" "}
              <span className="font-normal text-neutral-400">(optional)</span>
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Following up on my last email"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-neutral-900">HTML content</h2>
          <div className="flex items-center gap-2">
            <CopyButton html={html} />
            <div className="flex rounded-md border border-neutral-300 p-0.5 text-xs">
              <button
                onClick={() => setTab("code")}
                className={`rounded px-3 py-1 font-medium transition-colors ${
                  tab === "code" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Code
              </button>
              <button
                onClick={() => setTab("preview")}
                className={`rounded px-3 py-1 font-medium transition-colors ${
                  tab === "preview" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Preview
              </button>
            </div>
          </div>
        </div>

        {tab === "code" ? (
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            spellCheck={false}
            placeholder="Paste Gmail-safe HTML here (inline styles, table-based layout)..."
            className="h-96 w-full rounded-lg border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs leading-relaxed text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-neutral-600"
          />
        ) : (
          <div className="h-96 w-full overflow-auto rounded-lg border border-neutral-200 bg-neutral-50">
            {html.trim() ? (
              <iframe title="Template preview" srcDoc={html} className="h-full w-full bg-white" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                Nothing to preview yet
              </div>
            )}
          </div>
        )}
        <p className="mt-3 flex items-start gap-1.5 text-xs text-neutral-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-400"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
              clipRule="evenodd"
            />
          </svg>
          Gmail strips &lt;style&gt; tags and most CSS layout rules. Use inline{" "}
          <code className="rounded bg-neutral-100 px-1 py-px font-mono">style=&quot;&quot;</code>{" "}
          attributes and a table-based layout so the template renders correctly once imported into
          compose.
        </p>
      </section>

      <div className="flex items-center justify-between">
        <div>
          {existing && (
            <button
              onClick={handleDelete}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Delete template
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/")}
            className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || !html.trim()}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {existing ? "Save changes" : "Create template"}
          </button>
        </div>
      </div>
    </div>
  );
}
