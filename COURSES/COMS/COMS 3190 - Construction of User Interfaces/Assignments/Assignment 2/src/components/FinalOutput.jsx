//devank uppal
export default function FinalOutput({ template, sections, config, setView, handleReset }) {

    // builds the final prompt text from all the stuff user entered
    function buildPromptText() {
        let output = "";

        output = output + "### INSTRUCTIONS ###\n";
        if (config.tone !== "") {
            output = output + "- Use a " + config.tone + " tone.\n";
        }
        if (config.verbosity !== "") {
            output = output + "- Response level: " + config.verbosity + ".\n";
        }
        if (config.outputFormat !== "") {
            output = output + "- Format output as: " + config.outputFormat + ".\n";
        }

        output = output + "\n### PROMPT SECTIONS ###";

        // loop thru all sections and add user input
        for (let i = 0; i < sections.length; i++) {
            let s = sections[i];
            let sectionDef = template.sections[s.sectionId];

            output = output + "\n\n[" + sectionDef.label.toUpperCase() + "]";

            for (let j = 0; j < sectionDef.fields.length; j++) {
                let fieldDef = sectionDef.fields[j];
                let userVal = s.fields[fieldDef.key];

                if (userVal) {
                    output = output + "\n" + fieldDef.label + ": " + userVal;
                }
            }
        }

        return output;
    }

    let finalPrompt = buildPromptText();

    // copies final prompt
    function copyToClipboard() {
        navigator.clipboard.writeText(finalPrompt);
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Final Output</h1>
                <button
                    onClick={handleReset}
                    className="text-xs bg-red-600 hover:bg-red-500 px-3 py-1 rounded font-bold"
                >
                    RESET ALL
                </button>
            </div>

            <div className="bg-black border border-gray-800 p-8 rounded-xl mb-6">
                <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                    {finalPrompt}
                </pre>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => setView('builder')}
                    className="bg-gray-800 border border-gray-700 px-6 py-2 rounded text-sm hover:bg-gray-700"
                >
                    BACK
                </button>
                <button
                    onClick={copyToClipboard}
                    className="bg-blue-600 px-6 py-2 rounded text-sm font-bold hover:bg-blue-500"
                >
                    COPY PROMPT
                </button>
            </div>
        </div>
    )
}
