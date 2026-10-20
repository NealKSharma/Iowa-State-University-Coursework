// Neal Kaushik Sharma
export default function TemplateCard({ template, onSelect }) {
    return (
        <div
            // Checks which component is picked
            onClick={() => onSelect(template)}
            className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col gap-3 transition-all hover:border-gray-400 hover:bg-gray-800 cursor-pointer"
        >
            <h3 className="text-white font-semibold">{template.name}</h3>
            <p className="text-gray-400 text-sm flex-1">{template.description}</p>
            <button className="mt-1 bg-white text-gray-900 text-sm font-medium rounded-lg px-4 py-2 hover:bg-gray-200 self-start">
                SELECT
            </button>
        </div>
    )
}