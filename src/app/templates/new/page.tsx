import Link from "next/link";
import TemplateEditor from "@/components/TemplateEditor";

export default function NewTemplatePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
          <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
        </svg>
        Back to templates
      </Link>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900">New template</h1>
      <TemplateEditor />
    </div>
  );
}
