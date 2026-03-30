function Header() {
    const today = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    return (
        <header className="sticky top-0 z-20 border-b border-[#eadfd7] bg-[#fffaf7]/95 backdrop-blur">
            <div className="flex h-[72px] items-center justify-between pl-0 pr-2">
                <div className="flex items-center justify-between w-full">

                    {/* LEFT → LOGO */}
                    <div className="flex items-center -ml-2">                        <img
                        src="/src/assets/logo.png"
                        alt="Planora logo"
                        className="h-32 w-auto object-contain"
                    />
                    </div>

                    {/* RIGHT → DATE */}
                    <div className="rounded-full border border-[#eadfd7] bg-white px-4 py-2 text-sm text-[#7b6f67] shadow-sm">
                        {today}
                    </div>

                </div>
            </div>
        </header>
    );
}

export default Header;