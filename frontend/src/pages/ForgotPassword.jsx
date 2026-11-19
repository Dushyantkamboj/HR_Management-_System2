import { useState } from "react";
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { forgot_password } from "../api/forgotpassword/forgotpassword.js";

const ForgotPassword = () => {
  const [formData, setformData] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const result = await forgot_password(formData);
      setSent(true);
      toast.success(result?.message || "Reset link sent. Check your inbox.");
    } catch (error) {
      toast.error(error.message || "Unable to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F0F4F8] p-4 sm:p-6">
      <div className="w-full max-w-md rounded-3xl border border-[#F0F4F8] bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
          {sent ? (
            <CheckCircle2 className="text-green-600" />
          ) : (
            <Mail className="text-[#4F8EF7]" />
          )}
        </div>

        {sent ? (
          <>
            <h1 className="mt-5 text-2xl font-bold text-slate-900">Check your email</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              If an account exists for <span className="font-medium text-slate-700">{formData.email}</span>,
              we've sent a password reset link. The link expires in 15 minutes.
            </p>
            <button
              type="button"
              onClick={() => { setSent(false); setformData({ email: "" }); }}
              className="mt-6 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Use a different email
            </button>
          </>
        ) : (
          <>
            <h1 className="mt-5 text-2xl font-bold text-slate-900">Forgot your password?</h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <input
                  id="email"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none disabled:bg-slate-50"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C63FF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          </>
        )}

        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
