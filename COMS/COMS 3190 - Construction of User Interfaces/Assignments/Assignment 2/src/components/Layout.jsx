// Neal Kaushik Sharma
export default function Layout({ children, view, onReset }) {
    let step1Class = "text-gray-500";
    let step2Class = "text-gray-500";
    let step3Class = "text-gray-500";

    // If we are in the builder, config, or output view, we update the colors so we know where we're at
    if (view === "builder") {
        step1Class = "text-white font-bold underline";
    } else if (view === "config") {
        step1Class = "text-green-400";
        step2Class = "text-white font-bold underline";
    } else if (view === "output") {
        step1Class = "text-green-400";
        step2Class = "text-green-400";
        step3Class = "text-white font-bold underline";
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
                <button onClick={onReset} className="font-bold text-xl hover:text-gray-300">
                    AI Prompt Engineering Studio
                </button>

                {view !== 'home' && (
                    <div className="flex gap-4 text-xs">
                        <span className={step1Class}>BUILDER</span>
                        <span className="text-gray-800">|</span>
                        <span className={step2Class}>CONFIG</span>
                        <span className="text-gray-800">|</span>
                        <span className={step3Class}>OUTPUT</span>
                    </div>
                )}
                <span className="text-gray-500 text-sm">SE 3190 Assignment</span>
            </nav>
            <main className="max-w-6xl mx-auto px-6 py-10">
                {children}
            </main>
        </div>
    )
}