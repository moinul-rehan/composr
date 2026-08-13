"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import TemplateEditor from "@/components/TemplateEditor";
import AuthGate from "@/components/AuthGate";
import { getTemplate } from "@/lib/template-store";
import { EmailTemplate } from "@/lib/types";

const BackLink = (
  <Link
    href="/"
    className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-800"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
      <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
    </svg>
    Back to templates
  </Link>
);

function EditTemplateInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [template, setTemplate] = useState<EmailTemplate | null | undefined>(
    id ? undefined : null
  );

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getTemplate(id).then((found) => {
      if (!cancelled) setTemplate(found ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (template === undefined) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        {BackLink}
        <div className="h-40 animate-pulse rounded-xl border border-neutral-200 bg-white" />
      </div>
    );
  }

  if (template === null) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        {BackLink}
        <p className="text-sm text-neutral-500">Template not found.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 text-sm font-medium text-neutral-900 underline"
        >
          Back to templates
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      {BackLink}
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900">Edit template</h1>
      <TemplateEditor existing={template} />
    </div>
  );
}

export default function EditTemplatePage() {
  return (
    <AuthGate>
      <Suspense fallback={null}>
        <EditTemplateInner />
      </Suspense>
    </AuthGate>
  );
}
