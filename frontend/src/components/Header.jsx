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

console.log(type());



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
            className="relative overflow-hidden rounded-2xl px-8 py-6 flex items-center justify-between
      "
            style={{
                background:
                    'radial-gradient(circle at 30% 0%, #2A3374 0%, #0F1229 55%, #0B0D1F 100%)',
            }}
        >

            {/* LEFT: Date, Greeting, Stats */}

            <div className="flex flex-col gap-2">

                <span className="text-[#8B92C4] text-xs font-semibold tracking-wide">
                    {formattedDate.split(' ').join(' · ', 1)}
                </span>

                <h1 className="text-white text-3xl font-bold flex items-center gap-2">
                    {type}, {userName}
                    <span role="img" aria-label="wave">
                        👋
                    </span>
                </h1>

                <div className="flex items-center gap-2 text-sm text-[#A7ACC8] mt-1">
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