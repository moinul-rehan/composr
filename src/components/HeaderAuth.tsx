"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function HeaderAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-8 w-20 animate-pulse rounded-md bg-neutral-100" />;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("google")}
        className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800"
      >
        Sign in with Google
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-neutral-500">{session.user?.email}</span>
      <Link
        href="/settings"
        className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
      >
        Settings
      </Link>
      <button
        onClick={() => signOut()}
        className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
      >
        Sign out
      </button>
    </div>
  );
}
