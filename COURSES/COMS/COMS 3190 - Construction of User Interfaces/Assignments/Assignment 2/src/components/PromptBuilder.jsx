//devank uppal
import { useState } from 'react'
import Section from './Section'

export default function PromptBuilder({ template, sections, setSections, setView }) {
    const [showMenu, setShowMenu] = useState(false);

    // counts words (prob not perfect but good enough)
    function countWords(text) {
        if (!text) return 0;
        let words = text.trim().split(/\s+/);
        let count = 0;
        for (let i = 0; i < words.length; i++) {
            if (words[i] !== "") {
                count = count + 1;
            }
        }
        return count;
    }

    // updates field inside a section
    const handleFieldChange = (sectionId, key, value) => {
        let updatedList = [];
        for (let i = 0; i < sections.length; i++) {
            let current = sections[i];
            if (current.sectionId === sectionId) {
                let newFields = { ...current.fields }; // copy so we dont break state
                newFields[key] = value;
                updatedList.push({ ...current, fields: newFields });
            } else {
                updatedList.push(current);
            }
        }
        setSections(updatedList);
    }

    // remove a section
    const handleRemove = (id) => {
        let filtered = [];
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].sectionId !== id) {
                filtered.push(sections[i]);
            }
        }
        setSections(filtered);
    }

    // add new section at end
    const handleAdd = (id) => {
        let newSection = { sectionId: id, fields: {} };
        let newList = [];
        for (let i = 0; i < sections.length; i++) {
            newList.push(sections[i]); 
        }
        newList.push(newSection);
        setSections(newList);
        setShowMenu(false); // close dropdown
    }

    let messages = [];

    // go thru all sections nad validate
    for (let i = 0; i < sections.length; i++) {
        let s = sections[i];
        let def = template.sections[s.sectionId];

        for (let j = 0; j < def.fields.length; j++) {
            let field = def.fields[j];
            let val = s.fields[field.key] || "";

            if (val === "") {
                messages.push({
                    type: 'error',
                    message: def.label + ": " + field.label + " is required"
                });
            } else if (countWords(val) < field.minWords) {
                messages.push({
                    type: 'warning',
                    message: def.label + ": Needs " + field.minWords + " words minimum"
                });
            }
        }
    }

    // need at least 4 sections or else it yellsssws
    if (sections.length < 4) {
        messages.push({
            type: 'error',
            message: "You need at least 4 sections (Current: " + sections.length + ")"
        });
    }

    let hasErrors = false;
    for (let k = 0; k < messages.length; k++) {
        if (messages[k].type === 'error') {
            hasErrors = true;
        }
    }
    const canContinue = !hasErrors;

    let menuButtons = [];
    let sectionKeys = Object.keys(template.sections);

    // build dropdown for addng sections
    for (let x = 0; x < sectionKeys.length; x++) {
        let key = sectionKeys[x];
        let alreadyExists = false;

        for (let y = 0; y < sections.length; y++) {
            if (sections[y].sectionId === key) {
                alreadyExists = true;
            }
        }

        if (!alreadyExists) {
            menuButtons.push(
                <button
                    key={key}
                    onClick={() => handleAdd(key)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                    {template.sections[key].label}
                </button>
            );
        }
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Step 1: Build Your Prompt</h1>
                        <p className="text-gray-500 text-sm">{template.name}</p>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-blue-500"
                        >
                            + ADD SECTION
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded shadow-xl z-50">
                                {menuButtons}
                                {menuButtons.length === 0 && (
                                    <p className="p-2 text-xs text-gray-500">
                                        No more sections available
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    {sections.map(s => (
                        <Section
                            key={s.sectionId}
                            sectionDef={template.sections[s.sectionId]}
                            fields={s.fields}
                            onFieldChange={(key, val) => handleFieldChange(s.sectionId, key, val)}
                            onRemove={() => handleRemove(s.sectionId)}
                            isRequired={template.requiredSections.includes(s.sectionId)}
                        />
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        disabled={!canContinue}
                        onClick={() => setView('config')}
                        className={canContinue
                            ? "bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200"
                            : "bg-gray-800 text-gray-600 px-8 py-3 rounded-lg font-bold cursor-not-allowed"
                        }
                    >
                        GENERATE OUTPUT
                    </button>
                </div>
            </div>

            <div className="w-full lg:w-72">
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 sticky top-4">
                    <h3 className="text-white font-bold text-sm mb-4 border-b border-gray-800 pb-2">
                        VALIDATION STATUS
                    </h3>
                    {messages.length === 0 && (
                        <p className="text-green-500 text-xs font-bold">Ready to proceed</p>
                    )}
                    <div className="flex flex-col">
                        {messages.map((message, index) => {
                            let style = "bg-blue-900/20 border border-blue-800 text-blue-400";

                            if (message.type === 'error') {
                                style = "bg-red-900/20 border border-red-800 text-red-400";
                            } else if (message.type === 'warning') {
                                style = "bg-yellow-900/20 border border-yellow-800 text-yellow-400";
                            }

                            return (
                                <div key={index} className={`${style} p-2 rounded text-xs mb-2`}>
                                    {message.message}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
