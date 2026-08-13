"use client";

import { useEffect, useState } from "react";

export default function ApiKeyPanel() {
  const [key, setKey] = useState<string | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/api-keys")
      .then((res) => res.json())
      .then((data) => setKey(data.key));
  }, []);

  async function handleGenerate() {
    setBusy(true);
    try {
      const res = await fetch("/api/api-keys", { method: "POST" });
      const data = await res.json();
      setKey(data.key);
    } finally {
      setBusy(false);
    }
  }

  async function handleCopy() {
    if (!key) return;
    await navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-sm font-semibold text-neutral-900">Gmail Add-on API key</h2>
      <p className="mb-5 text-sm text-neutral-500">
        Paste this key into the Composr Gmail Add-on&apos;s settings so it can fetch your
        templates directly inside Gmail compose. Treat it like a password — anyone with this
        key can read (and create) your templates via the API.
      </p>

      {key === undefined ? (
        <div className="h-10 w-full max-w-md animate-pulse rounded-md bg-neutral-100" />
      ) : key ? (
        <div className="flex flex-wrap items-center gap-3">
          <code className="rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
            {key}
          </code>
          <button
            onClick={handleCopy}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleGenerate}
            disabled={busy}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
          >
            {busy ? "Regenerating…" : "Regenerate"}
          </button>
        </div>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={busy}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 disabled:opacity-50"
        >
          {busy ? "Generating…" : "Generate API key"}
        </button>
      )}
    </section>
  );
}
