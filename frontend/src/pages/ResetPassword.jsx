import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { reset_password, verify_reset_token } from "../api/forgotpassword/forgotpassword.js";

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

const ResetPassword = () => {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();

  const [status, setStatus] = useState("checking"); // checking | valid | invalid | done
  const [form, setForm] = useState({ password: "", confirm_password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const check = async () => {
      if (!token || !email) {
        if (active) setStatus("invalid");
        return;
      }
      try {
        await verify_reset_token({ token, email });
        if (active) setStatus("valid");
      } catch {
        if (active) setStatus("invalid");
      }
    };

    check();
    return () => { active = false; };
  }, [token, email]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (form.password.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }
    if (!PASSWORD_PATTERN.test(form.password)) {
      return toast.error("Use an uppercase letter, a lowercase letter, a number and a special character.");
    }
    if (form.password !== form.confirm_password) {
      return toast.error("Passwords do not match.");
    }

    setSubmitting(true);
    try {
      const result = await reset_password({ token, email, ...form });
      toast.success(result?.message || "Password reset successfully. Please log in.");
      setStatus("done");
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (error) {
      toast.error(error.message || "Unable to reset password.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-11 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F0F4F8] p-4 sm:p-6">
      <div className="w-full max-w-md rounded-3xl border border-[#F0F4F8] bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50">
          <KeyRound className="text-[#6C63FF]" />
        </div>

        {status === "checking" && (
          <>
            <h1 className="mt-5 text-2xl font-bold text-slate-900">Checking your link</h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="animate-spin" size={16} /> Please wait a moment...
            </p>
          </>
        )}

        {status === "invalid" && (
          <>
            <h1 className="mt-5 text-2xl font-bold text-slate-900">Link expired or invalid</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              This password reset link has expired or is no longer valid. Request a new one to continue.
            </p>
            <Link
              to="/forgotpassword"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#6C63FF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
              Request a new link
            </Link>
          </>
        )}

        {status === "done" && (
          <>
            <CheckCircle2 className="mt-5 text-green-600" size={36} />
            <h1 className="mt-3 text-2xl font-bold text-slate-900">Password updated</h1>
            <p className="mt-2 text-sm text-slate-500">Redirecting you to the login page...</p>
          </>
        )}

        {status === "valid" && (
          <>
            <h1 className="mt-5 text-2xl font-bold text-slate-900">Reset your password</h1>
            <p className="mt-2 text-sm text-slate-500">
              Choose a new password for <span className="font-medium text-slate-700">{email}</span>.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                  New password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    className={inputClass}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Use at least 8 characters with uppercase, lowercase, a number and a special character.
                </p>
              </div>

              <div>
                <label htmlFor="confirm_password" className="mb-2 block text-sm font-medium text-slate-700">
                  Confirm new password
                </label>
                <input
                  id="confirm_password"
                  type={showPassword ? "text" : "password"}
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder="Repeat your new password"
                  autoComplete="new-password"
                  className={inputClass}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C63FF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {submitting ? "Updating..." : "Set new password"}
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

export default ResetPassword;
