import Link from "next/link";
import TemplateList from "@/components/TemplateList";
import AuthGate from "@/components/AuthGate";

export default function Home() {
  return (
    <AuthGate>
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-10 flex flex-col gap-4 border-b border-neutral-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Email templates
          </h1>
          <p className="mt-1.5 max-w-md text-sm text-neutral-500">
            Manage your HTML email templates, then copy one straight into a Gmail compose
            window whenever you need it.
          </p>
        </div>
        <Link
          href="/templates/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          New template
        </Link>
      </div>
      <TemplateList />
    </div>
    </AuthGate>
  );
}
