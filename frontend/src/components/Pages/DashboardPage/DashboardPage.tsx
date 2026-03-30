function DashboardPage() {
    return (
        <section className="space-y-6">
            <div>
                <p className="mb-2 text-sm uppercase tracking-[0.24em] text-[#b08f82]">
                    Dashboard
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-[#3c312c]">
                    Welcome back ✨
                </h2>
                <p className="mt-2 max-w-2xl text-[#6f625b]">
                    This will become your main life overview with study plans, weekly priorities,
                    and money decisions in one soft organized space.
                </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-[30px] border border-[#eadfd7] bg-white p-5 shadow-[0_10px_25px_rgba(97,72,57,0.05)]">
                    <p className="text-sm text-[#b08f82]">Today’s focus</p>
                    <h3 className="mt-2 text-xl font-semibold text-[#3c312c]">Top 3 priorities</h3>
                    <p className="mt-2 text-sm text-[#6f625b]">
                        We’ll turn this into your daily overview card.
                    </p>
                </div>

                <div className="rounded-[28px] border border-[#eadfd7] bg-white p-5 shadow-sm">
                    <p className="text-sm text-[#b08f82]">Study</p>
                    <h3 className="mt-2 text-xl font-semibold text-[#3c312c]">Upcoming revision</h3>
                    <p className="mt-2 text-sm text-[#6f625b]">
                        This area will show planned subjects and review tasks.
                    </p>
                </div>

                <div className="rounded-[28px] border border-[#eadfd7] bg-white p-5 shadow-sm">
                    <p className="text-sm text-[#b08f82]">Money</p>
                    <h3 className="mt-2 text-xl font-semibold text-[#3c312c]">Buy now / pay now</h3>
                    <p className="mt-2 text-sm text-[#6f625b]">
                        This will connect to your drag-and-drop money planner.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default DashboardPage;