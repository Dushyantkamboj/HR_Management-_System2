import { useState } from "react";
import {
  Lock,
  CheckCircle2,
  Users,
  TrendingUp,
  Search,
  LayoutGrid,
  Table2,
  Plus,
  SquarePen,
  Trash2,
} from "lucide-react";

/* ---------------------------------- DATA ---------------------------------- */

const CATEGORIES = [
  { key: "Employee", total: 5 },
  { key: "Attendance", total: 3 },
  { key: "Leave", total: 4 },
  { key: "Events", total: 3 },
  { key: "Payroll", total: 3 },
  { key: "Reports", total: 3 },
  { key: "System", total: 3 },
];
const TOTAL_PERMS = CATEGORIES.reduce((sum, c) => sum + c.total, 0); // 24

// Tailwind needs full class names, so each theme is spelled out
const THEMES = {
  indigo: {
    bar: "bg-gradient-to-r from-indigo-500 to-violet-500",
    icon: "bg-gradient-to-br from-indigo-500 to-violet-500 shadow-indigo-200",
    num: "text-indigo-500",
    fill: "bg-gradient-to-r from-indigo-500 to-violet-500",
    chip: "border-indigo-200 bg-indigo-50 text-indigo-600",
    link: "text-indigo-500",
  },
  blue: {
    bar: "bg-gradient-to-r from-blue-500 to-sky-400",
    icon: "bg-gradient-to-br from-blue-500 to-sky-400 shadow-blue-200",
    num: "text-blue-500",
    fill: "bg-gradient-to-r from-blue-500 to-sky-400",
    chip: "border-blue-200 bg-blue-50 text-blue-600",
    link: "text-blue-500",
  },
  emerald: {
    bar: "bg-gradient-to-r from-emerald-500 to-green-400",
    icon: "bg-gradient-to-br from-emerald-500 to-green-400 shadow-emerald-200",
    num: "text-emerald-500",
    fill: "bg-gradient-to-r from-emerald-500 to-green-400",
    chip: "border-emerald-200 bg-emerald-50 text-emerald-600",
    link: "text-emerald-500",
  },
  amber: {
    bar: "bg-gradient-to-r from-orange-400 to-yellow-400",
    icon: "bg-gradient-to-br from-orange-400 to-yellow-400 shadow-orange-200",
    num: "text-orange-500",
    fill: "bg-gradient-to-r from-orange-400 to-yellow-400",
    chip: "border-orange-200 bg-orange-50 text-orange-600",
    link: "text-orange-500",
  },
  rose: {
    bar: "bg-gradient-to-r from-rose-500 to-orange-400",
    icon: "bg-gradient-to-br from-rose-500 to-orange-400 shadow-rose-200",
    num: "text-rose-500",
    fill: "bg-gradient-to-r from-rose-500 to-orange-400",
    chip: "border-rose-200 bg-rose-50 text-rose-600",
    link: "text-rose-500",
  },
  violet: {
    bar: "bg-gradient-to-r from-violet-500 to-purple-400",
    icon: "bg-gradient-to-br from-violet-500 to-purple-400 shadow-violet-200",
    num: "text-violet-500",
    fill: "bg-gradient-to-r from-violet-500 to-purple-400",
    chip: "border-violet-200 bg-violet-50 text-violet-600",
    link: "text-violet-500",
  },
};

const AVATAR_COLORS = ["bg-indigo-500", "bg-blue-500", "bg-rose-500", "bg-emerald-500", "bg-orange-400"];

const ROLES = [
  {
    id: 1, name: "Super Admin", system: true, theme: "indigo",
    desc: "Full system access with no restrictions",
    perms: { Employee: 5, Attendance: 3, Leave: 4, Events: 3, Payroll: 3, Reports: 3, System: 3 },
    users: 2, people: ["JD", "PN"],
  },
  {
    id: 2, name: "HR Manager", theme: "blue",
    desc: "Manages HR operations and employee records",
    perms: { Employee: 4, Attendance: 3, Leave: 4, Events: 3, Reports: 3 },
    users: 5, people: ["SA", "KM", "EV", "TH"],
  },
  {
    id: 3, name: "Team Lead", theme: "emerald",
    desc: "Oversees team attendance and leave approvals",
    perms: { Employee: 1, Attendance: 2, Leave: 3, Events: 1, Reports: 1 },
    users: 14, people: ["MC", "DO"],
  },
  {
    id: 4, name: "Employee", theme: "amber",
    desc: "Standard access for regular employees",
    perms: { Employee: 1, Attendance: 2, Leave: 2 },
    users: 98, people: ["AL", "RS", "BK"],
  },
  {
    id: 5, name: "Payroll Officer", theme: "rose",
    desc: "Manages salary processing and payslips",
    perms: { Employee: 1, Attendance: 1, Payroll: 3, Reports: 2 },
    users: 3, people: ["PO", "LN"],
  },
  {
    id: 6, name: "Recruiter", theme: "violet",
    desc: "Handles new hire onboarding and profiles",
    perms: { Employee: 4, Leave: 1, Events: 2, Reports: 1 },
    users: 4, people: ["RC", "ZY", "FG"],
  },
];

const sumPerms = (perms) => Object.values(perms).reduce((a, b) => a + b, 0);

/* Top summary cards (values are calculated from ROLES) */
const totalUsers = ROLES.reduce((s, r) => s + r.users, 0);
const avgPerms = Math.round(ROLES.reduce((s, r) => s + sumPerms(r.perms), 0) / ROLES.length);
const systemRoles = ROLES.filter((r) => r.system).length;

const STATS = [
  {
    value: ROLES.length,
    label: "Total Roles",
    sub: `${systemRoles} system · ${ROLES.length - systemRoles} custom`,
    icon: Lock,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-500",
    glow: "bg-violet-300/40",
    bar: "from-violet-300 to-violet-400",
  },
  {
    value: TOTAL_PERMS,
    label: "Total Permissions",
    sub: `Across ${CATEGORIES.length} categories`,
    icon: CheckCircle2,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    glow: "bg-blue-300/40",
    bar: "from-blue-300 to-blue-500",
  },
  {
    value: totalUsers,
    label: "Users Assigned",
    sub: "Across all roles combined",
    icon: Users,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-500",
    glow: "bg-emerald-300/40",
    bar: "from-emerald-300 to-emerald-400",
  },
  {
    value: avgPerms,
    label: "Avg. Permissions/Role",
    sub: "Per-role coverage average",
    icon: TrendingUp,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-400",
    glow: "bg-orange-300/40",
    bar: "from-orange-300 to-orange-400",
  },
];

/* -------------------------------- COMPONENTS ------------------------------- */

const StatCard = ({ value, label, sub, icon: Icon, iconBg, iconColor, glow, bar }) => (
  <div className="relative overflow-hidden rounded-3xl bg-white p-6 pb-7 shadow-sm">
    {/* soft glow, top right */}
    <div className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full blur-2xl ${glow}`} />

    <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} ${iconColor}`}>
      <Icon size={24} strokeWidth={1.8} />
    </div>

    <p className="relative mt-4 text-[40px] font-extrabold leading-none text-slate-900">{value}</p>
    <p className="relative mt-3 text-[15px] font-bold text-slate-700">{label}</p>
    <p className="relative mt-1 text-[13px] text-slate-400">{sub}</p>

    {/* bottom accent bar */}
    <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${bar}`} />
  </div>
);

const RoleCard = ({ role }) => {
  const t = THEMES[role.theme];
  const count = sumPerms(role.perms);
  const coverage = Math.round((count / TOTAL_PERMS) * 100);

  const boxes = [
    { label: "Permissions", value: count },
    { label: "Users", value: role.users },
    { label: "Coverage", value: `${coverage}%` },
  ];
  const boxColors = [t.num, "text-emerald-500", "text-orange-500"];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-6 pt-7 shadow-sm">
      <div className={`absolute inset-x-0 top-0 h-1.5 ${t.bar}`} />

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg ${t.icon}`}>
          <Lock size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-bold text-slate-900">{role.name}</h3>
            {role.system && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold tracking-wider text-slate-500">
                SYSTEM
              </span>
            )}
          </div>
          <p className="mt-1 text-sm leading-snug text-slate-400">{role.desc}</p>
        </div>
        {!role.system && (
          <div className="flex gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100">
              <SquarePen size={15} />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-500 transition hover:bg-rose-100">
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Stat boxes */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {boxes.map((s, i) => (
          <div key={s.label} className="rounded-2xl border border-slate-100 bg-slate-50 py-3 text-center">
            <p className={`text-2xl font-extrabold ${boxColors[i]}`}>{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${t.fill}`} style={{ width: `${coverage}%` }} />
      </div>

      {/* Category chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES.filter((c) => role.perms[c.key]).map((c) => {
          const have = role.perms[c.key];
          const full = have === c.total;
          return (
            <span
              key={c.key}
              className={`rounded-lg border px-2.5 py-1 text-[13px] font-medium ${
                full ? t.chip : "border-slate-200 bg-slate-50 text-slate-500"
              }`}
            >
              {c.key} {full ? "✓" : `${have}/${c.total}`}
            </span>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex">
            {role.people.slice(0, 4).map((p, i) => (
              <div
                key={p}
                className={`-ml-2 flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white first:ml-0 ${
                  AVATAR_COLORS[i % AVATAR_COLORS.length]
                }`}
              >
                {p}
              </div>
            ))}
          </div>
          <span className="text-sm text-slate-500">{role.users} users</span>
        </div>
        <button className={`text-sm font-semibold ${t.link}`}>View details →</button>
      </div>
    </div>
  );
};

const MatrixView = ({ roles }) => (
  <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-slate-100 text-slate-500">
          <th className="px-6 py-4 font-semibold">Role</th>
          {CATEGORIES.map((c) => (
            <th key={c.key} className="px-4 py-4 text-center font-semibold">{c.key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {roles.map((r) => (
          <tr key={r.id} className="border-b border-slate-50 last:border-0">
            <td className="px-6 py-4 font-semibold text-slate-800">{r.name}</td>
            {CATEGORIES.map((c) => {
              const have = r.perms[c.key] || 0;
              return (
                <td key={c.key} className="px-4 py-4 text-center">
                  {have === c.total ? (
                    <span className="text-emerald-500">✓</span>
                  ) : have > 0 ? (
                    <span className="text-slate-500">{have}/{c.total}</span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ---------------------------------- PAGE ---------------------------------- */

const RolePermission = () => {
  const [query, setQuery] = useState("");
  const [view, setView] = useState("cards");

  const filtered = ROLES.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  const tabBase = "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition";

  return (
    <div className="min-h-screen bg-slate-100 p-6 font-sans">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-72">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roles..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-[15px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="flex gap-1 rounded-2xl border border-slate-200 bg-white p-1">
            <button
              onClick={() => setView("cards")}
              className={`${tabBase} ${
                view === "cards" ? "bg-blue-500 text-white shadow" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <LayoutGrid size={16} /> Cards
            </button>
            <button
              onClick={() => setView("matrix")}
              className={`${tabBase} ${
                view === "matrix" ? "bg-blue-500 text-white shadow" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Table2 size={16} /> Matrix
            </button>
          </div>
        </div>

        <button className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-indigo-200 transition hover:opacity-90">
          <Plus size={18} /> Add Role
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {view === "cards" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((role) => (
              <RoleCard key={role.id} role={role} />
            ))}
          </div>
        ) : (
          <MatrixView roles={filtered} />
        )}

        {filtered.length === 0 && (
          <p className="py-16 text-center text-slate-400">No roles match "{query}".</p>
        )}
      </div>
    </div>
  );
};

export default RolePermission;