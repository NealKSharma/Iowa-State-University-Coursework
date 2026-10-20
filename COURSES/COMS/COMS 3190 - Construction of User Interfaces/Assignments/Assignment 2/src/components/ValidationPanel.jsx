// Neal Kaushik Sharma
export default function ValidationPanel({ messages }) {
    let errorItems = [];
    let warningItems = [];
    let suggestionItems = [];

    // Loop through all the messages we got from the builder or config screens
    for (let i = 0; i < messages.length; i++) {
        let m = messages[i];
        if (m.type === "error") {
            errorItems.push(<div key={i} className="bg-red-900/20 border border-red-800 p-2 rounded text-red-400 text-xs mb-2">{m.message}</div>);
        } else if (m.type === "warning") {
            warningItems.push(<div key={i} className="bg-yellow-900/20 border border-yellow-800 p-2 rounded text-yellow-400 text-xs mb-2">{m.message}</div>);
        } else {
            suggestionItems.push(<div key={i} className="bg-blue-900/20 border border-blue-800 p-2 rounded text-blue-400 text-xs mb-2">{m.message}</div>);
        }
    }

    return (
        // main box for the panel
        <div className="bg-bg-black border border-gray-800 rounded-xl p-4 sticky top-4">
            <h3 className="text-white font-bold text-sm mb-4 border-b border-gray-800 pb-2">VALIDATION STATUS</h3>
            {messages.length === 0 && (
                <p className="text-green-500 text-xs font-bold">Ready to proceed</p>
            )}
            <div className="flex flex-col">
                {errorItems}
                {warningItems}
                {suggestionItems}
            </div>
        </div>
    )
}