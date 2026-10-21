"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

function VerificationPendingContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  async function handleResend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    setLoading(true);
    setMessage("");
    setStatus(null);

    try {
      const response = await api.post(
        "/api/v1/auth/resend-verification-email",
        { email: normalizedEmail },
      );

      setStatus("success");
      setMessage(
        response.data?.message ??
          "If your account needs verification, an email will be sent shortly.",
      );
    } catch (error: unknown) {
      const err = error as {
        response?: {
          data?: { message?: string };
        };
      };

      setStatus("error");
      setMessage(
        err.response?.data?.message ??
          "We couldn't process your request. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
          <span aria-hidden="true">✉️</span>
        </div>

        <h1 className="text-center text-2xl font-bold text-gray-900">
          Check your email
        </h1>

        <p className="mt-3 text-center text-sm leading-6 text-gray-600">
          Verify your email address before signing in. Open the verification
          link in your inbox, and check your spam folder if you cannot find it.
        </p>

        <form onSubmit={handleResend} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {message && (
            <p
              role="status"
              aria-live="polite"
              className={`text-sm ${
                status === "success" ? "text-green-700" : "text-red-700"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Resend verification email"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Already verified?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}

export default function VerificationPendingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerificationPendingContent />
    </Suspense>
  );
}
