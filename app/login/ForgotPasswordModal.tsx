import { useState } from "react";
import { requestPasswordReset } from "@/lib/api/auth";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await requestPasswordReset({ email });
      if (response.message) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setEmail("");
        }, 3000);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to send reset link.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-border rounded-xl shadow-soft p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Reset Password
        </h3>
        {success ? (
          <div className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 p-4 rounded-xl text-sm font-bold text-center">
            Reset link sent to your email. You can close this window.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Enter the email address associated with your account, and
              we&apos;ll send you a link to reset your password.
            </p>

            {error && (
              <div className="bg-rose-50 text-rose-600 dark:bg-rose-950/40 p-3 rounded-xl text-sm font-bold text-center mb-4">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-border/50 bg-muted/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:bg-zinc-800 dark:text-white"
                placeholder="student@school.edu"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !email}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
