// Neal Kaushik Sharma
import ValidationPanel from './ValidationPanel'

export default function ConfigValidation({ template, sections, config, setConfig, setView }) {
    // Counts how many words there are in a given strnig
    function countWords(str) {
        if (!str) return 0;
        let parts = str.trim().split(/\s+/);
        let total = 0;
        for (let i = 0; i < parts.length; i++) {
            if (parts[i] !== "") {
                total = total + 1;
            }
        }
        return total;
    }

    let messages = [];

    for (let i = 0; i < sections.length; i++) {
        let currentSection = sections[i];
        let definition = template.sections[currentSection.sectionId];

        for (let j = 0; j < definition.fields.length; j++) {
            let field = definition.fields[j];
            let value = currentSection.fields[field.key] || "";

            if (value === "") {
                messages.push({ type: 'error', message: definition.label + ": " + field.label + " is empty" });
            } else if (countWords(value) < field.minWords) {
                messages.push({ type: 'warning', message: definition.label + ": " + field.label + " needs more words" });
            }
        }
    }

    // Checks
    if (config.tone === "") {
        messages.push({ type: 'warning', message: "Tone is not selected" });
    }
    if (config.verbosity === "") {
        messages.push({ type: 'warning', message: "Verbosity is not selected" });
    }
    if (config.outputFormat === "") {
        messages.push({ type: 'warning', message: "Output format is not selected" });
    }

    // Check to block the "generate" button
    let blockButton = false;
    for (let k = 0; k < messages.length; k++) {
        if (messages[k].type === "error") {
            blockButton = true;
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Final Configuration</h2>
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
                    <div className="mb-4">
                        <label className="text-gray-400 block mb-2">Select Tone</label>
                        <select
                            className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700"
                            value={config.tone}
                            onChange={(e) => setConfig({ ...config, tone: e.target.value })}
                        >
                            <option value="">-- Select --</option>
                            {template.configurations.tones.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-400 block mb-2">Select Verbosity</label>
                        <select
                            className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700"
                            value={config.verbosity}
                            onChange={(e) => setConfig({ ...config, verbosity: e.target.value })}
                        >
                            <option value="">-- Select --</option>
                            {template.configurations.verbosityLevels.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-400 block mb-2">Select Output Format</label>
                        <select
                            className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700"
                            value={config.outputFormat}
                            onChange={(e) => setConfig({ ...config, outputFormat: e.target.value })}
                        >
                            <option value="">-- Select --</option>
                            {template.configurations.outputFormats.map(f => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex gap-2">
                    <button onClick={() => setView('builder')} className="bg-gray-700 px-4 py-2 rounded">Back</button>
                    <button
                        disabled={blockButton}
                        onClick={() => setView('output')}
                        className={blockButton ? "bg-gray-800 text-gray-500 px-4 py-2 rounded" : "bg-blue-600 px-4 py-2 rounded"}
                    >
                        Generate Prompt
                    </button>
                </div>
            </div>

            <div className="w-full md:w-64">
                <ValidationPanel messages={messages} />
            </div>
        </div>
    )
}