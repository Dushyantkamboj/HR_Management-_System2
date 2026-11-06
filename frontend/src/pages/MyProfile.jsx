import { useState } from "react";
import { User, Lock, Mail, Check, Info } from "lucide-react";
import ProfileHeader from "../components/ProfileHeader";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import { change_employee_password } from "../api/user/changePassword";

const MyProfile = () => {
  const name = Cookies.get('name');
  const email=Cookies.get('email');
  const type=parseInt(Cookies.get('type'))

  const [profile, setProfile] = useState({
    fullName: name,
    email:email,
    role: type=== 1?"Admin":type=== 2?"HR":type===3?"Employee":" ",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSave = () => {
    console.log("Save profile", profile);
  };

  const handlePasswordUpdate = async () => {

    if (!passwords.current) return toast.error("Enter your current password.");
    if (passwords.next.length < 8) return toast.error("Use at least 8 characters.");
    if (passwords.next !== passwords.confirm)
      return toast.error("Passwords do not match.");

    try {

      setPasswordLoading(true);

      const result = await change_employee_password({
        current_password: passwords.current,
        new_password: passwords.next,
        confirm_password: passwords.confirm,
      });

      console.log("result:", result);

      // Works whether your API function returns response.data or the full axios response
      const success = result?.status === 1 || result?.data?.status === 1;

      if (success) {

        toast.success(
          result?.message ||
          result?.data?.message ||
          "Password changed successfully"
        );

        setPasswords({ current: "", next: "", confirm: "" });

      }

    } catch (error) {

      console.log(error.message);

    } finally {

      setPasswordLoading(false);

    }

  };

  const inputBase =
    "w-full h-[54px] rounded-xl border border-slate-200 bg-slate-50 px-4 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100";

  return (

    <div className="min-h-screen bg-slate-100 p-6 font-sans">
      <div className="max-h-screen mb-10  bg-slate-100  font-sans">
        <ProfileHeader
          name={profile.fullName}
          role={profile.role}
          email={profile.email}
        />
      </div>
      <div className="flex flex-col items-start gap-6 lg:flex-row">
        {/* Personal information */}
        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-sm lg:w-[720px]">
          <div className="flex items-center gap-4 border-b border-slate-100 px-7 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Personal information
              </h2>
              <p className="text-sm text-slate-400">
                Manage your name, email and workplace role
              </p>
            </div>
          </div>

          <div className="space-y-6 px-7 py-7">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full name
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
                className={inputBase}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className={`${inputBase} cursor-not-allowed bg-slate-100 pl-12 text-slate-500`}
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Your email is managed by your organization and cannot be
                changed here.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Role
              </label>
              <select
                value={profile.role}
                onChange={(e) =>
                  setProfile({ ...profile, role: e.target.value })
                }
                className={`${inputBase} cursor-pointer`}
              >
                <option>HR Administrator</option>
                <option>HR Manager</option>
                <option>Recruiter</option>
                <option>Employee</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-7 py-5">
            {/* <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button> */}
            {/* <button
              type="button"
              onClick={handleProfileSave}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:opacity-90"
            >
              <Check size={16} />
              Save changes
            </button> */}
          </div>
        </div>

        {/* Change password */}
        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-sm lg:w-[566px]">
          <div className="flex items-center gap-4 border-b border-slate-100 px-7 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
              <Lock size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Change password
              </h2>
              <p className="text-sm text-slate-400">Keep your account secure</p>
            </div>
          </div>

          <div className="space-y-5 px-7 py-7">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Current password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                placeholder="Enter current password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
                className={inputBase}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                New password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                placeholder="Enter new password"
                value={passwords.next}
                onChange={(e) =>
                  setPasswords({ ...passwords, next: e.target.value })
                }
                className={inputBase}
              />
              <p className="mt-2 text-xs text-slate-400">
                Use at least 8 characters.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm new password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                placeholder="Repeat new password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
                className={inputBase}
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
              />
              Show passwords
            </label>

            <button
              type="button"
              onClick={handlePasswordUpdate}
              disabled={passwordLoading}
              className="w-full rounded-xl bg-[#18265a] py-4 text-[15px] font-semibold text-white shadow-lg shadow-slate-300 transition hover:bg-[#1f2f6e] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {passwordLoading ? "Updating..." : "Update password"}
            </button>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-4 text-[13px] text-slate-500">
              <Info size={16} className="shrink-0 text-blue-500" />
              Changing your password will sign you out of all other active
              sessions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;