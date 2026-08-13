"use client";

import { signIn, useSession } from "next-auth/react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="h-64 animate-pulse rounded-xl border border-neutral-200 bg-white" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center px-6 py-24 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          Sign in to Composr
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Sign in with Google to manage your templates and send drafts straight to Gmail.
        </p>
        <button
          onClick={() => signIn("google")}
          className="mt-6 rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-neutral-800"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
