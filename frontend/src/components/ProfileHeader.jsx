const ProfileHeader = ({
  name = "James Darrow",
  role = "HR Administrator",
  email = "james.darrow@gmail.com",
  status = "Active account",
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      {/* Banner */}
      <div className="relative h-[135px] overflow-hidden bg-gradient-to-r from-[#27406f] via-[#4b8df5] to-[#6a6bff]">
        <div className="absolute -right-6 -top-10 h-[190px] w-[190px] rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -right-16 h-[150px] w-[150px] rounded-full bg-white/10" />
      </div>

      {/* Info row */}
      <div className="relative flex flex-col gap-4 px-5 pb-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          {/* Avatar overlapping the banner */}
          <div className="-mt-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-[26px] bg-white shadow-[0_12px_28px_-6px_rgba(244,63,94,0.35)] sm:h-[104px] sm:w-[104px]">
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-orange-400 to-rose-500 text-2xl font-bold text-white sm:h-[88px] sm:w-[88px] sm:text-[28px]">
              {initials}
            </div>
          </div>

          <div className="min-w-0 pt-4 sm:pt-5">
            <h1 className="break-words text-xl font-extrabold text-slate-900 sm:text-2xl">{name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 sm:text-sm">
              <span>{role}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              <span className="break-all">{email}</span>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          {status}
        </span>
      </div>
    </div>
  );
};

export default ProfileHeader;