"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EmailTemplate, TemplateCategory } from "@/lib/types";
import { listTemplates, saveTemplate } from "@/lib/template-store";
import { SAMPLE_FOLLOWUP_HTML } from "@/lib/sample-templates";
import CopyButton from "@/components/CopyButton";

const CATEGORY_COLORS: Record<TemplateCategory, string> = {
  "Follow-up": "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/10",
  "Cold Outreach": "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/10",
  Newsletter: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10",
  Announcement: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10",
  Other: "bg-neutral-100 text-neutral-600 ring-1 ring-inset ring-neutral-500/10",
};

export default function TemplateList() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTemplates(listTemplates());
    setLoaded(true);
  }, []);

  function addSample() {
    saveTemplate({
      name: "Follow-up after no reply",
      category: "Follow-up",
      subject: "Following up on my last email",
      html: SAMPLE_FOLLOWUP_HTML,
    });
    setTemplates(listTemplates());
  }

  if (!loaded) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-xl border border-neutral-200 bg-white" />
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-neutral-300 bg-white/60 px-6 py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-6 w-6 text-neutral-400"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5v10.5a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V6.75z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75 12 13.5l8.25-6.75" />
          </svg>
        </div>
        <h2 className="text-base font-medium text-neutral-900">No templates yet</h2>
        <p className="mt-1.5 max-w-sm text-sm text-neutral-500">
          Create your first HTML email template, or start from a sample to see how it works.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/templates/new"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800"
          >
            New template
          </Link>
          <button
            onClick={addSample}
            className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Add a sample template
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-xs font-medium tracking-wide text-neutral-400 uppercase">
        {templates.length} {templates.length === 1 ? "template" : "templates"}
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <div
            key={t.id}
            className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <Link href={`/templates/edit?id=${t.id}`} className="block">
              <div className="h-32 overflow-hidden border-b border-neutral-100 bg-neutral-50">
                <iframe
                  title={t.name}
                  srcDoc={t.html}
                  tabIndex={-1}
                  className="h-[320px] w-full origin-top-left scale-[0.417] pointer-events-none"
                />
              </div>
            </Link>
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <Link href={`/templates/edit?id=${t.id}`} className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-neutral-900 group-hover:text-neutral-950">
                    {t.name}
                  </h3>
                </Link>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${CATEGORY_COLORS[t.category]}`}
                >
                  {t.category}
                </span>
              </div>
              {t.subject ? (
                <p className="mb-3 truncate text-xs text-neutral-500">Subject: {t.subject}</p>
              ) : (
                <p className="mb-3 text-xs text-neutral-300">No default subject</p>
              )}
              <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-3">
                <p className="text-[11px] text-neutral-400">
                  Updated {new Date(t.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </p>
                <CopyButton html={t.html} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
