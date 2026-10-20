//devank uppal
export default function Section({ sectionDef, fields, onFieldChange, onRemove, isRequired }) {

    // quick word counter (not perfect but works)
    function checkWords(val) {
        if (!val) return 0;

        let arr = val.trim().split(" ");
        let count = 0;

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] !== "" && arr[i] !== " ") {
                count = count + 1;
            }
        }

        return count;
    }

    return (
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl mb-5">
            <div className="flex justify-between mb-4">
                <h3 className="font-bold text-white">{sectionDef.label}</h3>

                {/* only show if remvoable */}
                {isRequired === false && (
                    <button onClick={onRemove} className="text-red-500 text-xs uppercase">
                        Remove
                    </button>
                )}
            </div>

            {sectionDef.fields.map(f => {
                let currentVal = fields[f.key] || '';
                let numWords = checkWords(currentVal); // count words

                return (
                    <div key={f.key} className="mb-4">
                        <label className="text-gray-500 text-xs block mb-1">
                            {f.label}
                        </label>

                        <textarea
                            className="w-full bg-bg-black border border-gray-800 p-3 text-white rounded focus:border-gray-600 outline-none"
                            value={currentVal}
                            onChange={(e) => onFieldChange(f.key, e.target.value)}
                            placeholder={f.placeholder}
                            rows="3"
                        />

                        {/* show feeack after tying */}
                        {currentVal !== "" && (
                            <span
                                className={
                                    numWords < f.minWords
                                        ? "text-orange-500 text-xs"
                                        : "text-blue-400 text-xs"
                                }
                            >
                                {numWords < f.minWords
                                    ? "Under minimum: " + numWords + "/" + f.minWords
                                    : "Word count OK: " + numWords}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}