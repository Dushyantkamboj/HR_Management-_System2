import Cookies from 'js-cookie';

const name=Cookies.get('name')

const type=()=>{
const currentDate = new Date();

const hour = currentDate.getHours();

if (hour < 12) {
    return "Good Morning";
} 
else if (hour < 17) {
    return "Good Afternoon";
} 
else {
    return "Good Evening";
}
}

const Header = ({
    userName = name,
    pendingLeaveRequests = 7,
    upcomingEvents = 3,
}) => {
    const today = new Date();

    const formattedDate = today
        .toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        .toUpperCase();

    return (
        <div
            className="relative flex items-center justify-between overflow-hidden rounded-2xl px-4 py-5 sm:px-8 sm:py-6"
            style={{
                background:
                    'radial-gradient(circle at 30% 0%, #2A3374 0%, #0F1229 55%, #0B0D1F 100%)',
            }}
        >

            {/* LEFT: Date, Greeting, Stats */}

            <div className="flex min-w-0 flex-col gap-2">

                <span className="text-[#8B92C4] text-xs font-semibold tracking-wide">
                    {formattedDate.split(' ').join(' · ', 1)}
                </span>

                <h1 className="flex flex-wrap items-center gap-2 text-xl font-bold text-white sm:text-3xl">
                    {type()}, {userName}
                    <span role="img" aria-label="wave">
                        👋
                    </span>
                </h1>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#A7ACC8] sm:text-sm">
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                        {pendingLeaveRequests} leave requests pending
                    </span>

                    <span className="text-[#4B4F73]">·</span>

                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                        {upcomingEvents} upcoming events
                    </span>
                </div>

            </div>

        </div>
    );
};

export default Header;