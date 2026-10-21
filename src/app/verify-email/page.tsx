"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

type VerificationStatus = "verifying" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<VerificationStatus>("verifying");
  const [message, setMessage] = useState("Verifying your email address...");
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;

    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("The verification link is missing its token.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await api.post("/api/v1/auth/verify-email", {
          token,
        });

        setStatus("success");
        setMessage(
          response.data?.message ??
            "Your email has been verified successfully.",
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
            "We could not verify your email. The link may have expired or already been used.",
        );
      }
    };

    void verifyEmail();
  }, [searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <section
        className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm"
        aria-live="polite"
      >
        {status === "verifying" && (
          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        )}

        {status === "success" && (
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
            ✓
          </div>
        )}

        {status === "error" && (
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-700">
            !
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-900">
          {status === "verifying"
            ? "Verifying your email"
            : status === "success"
              ? "Email verified"
              : "Verification failed"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">{message}</p>

        {status === "success" && (
          <Link
            href="/login"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Continue to login
          </Link>
        )}

        {status === "error" && (
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/verify-email/pending"
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Return to verification instructions
            </Link>

            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Back to login
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading verification page...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
