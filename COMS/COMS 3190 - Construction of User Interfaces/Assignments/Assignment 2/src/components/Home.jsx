//devank uppal

export default function Home({ templates, onSelect }) {
    const featureData = [
        { title: "Part-by-Part Design", text: "We split prompts into a role, a style, and rules so the AI stays on track." },
        { title: "Minimum Word Checks", text: "The app makes sure you wrote enough for each part so the result isn't too short." },
        { title: "Output Settings", text: "Pick the tone and format before you finish so the AI talks how you want." }
    ];

    let featureList = [];
    for (let i = 0; i < featureData.length; i++) {
        let item = featureData[i];
        featureList.push(
            <div key={i} className="bg-gray-800 p-4 border border-slate-800 rounded">
                <span className="text-red-400 font-bold block mb-1">{item.title}</span>
                <span className="text-sm text-white">{item.text}</span>
            </div>
        );
    }

    let cardList = [];
    for (let j = 0; j < templates.length; j++) {
        let t = templates[j];
        cardList.push(
            <div
                key={t.id}
                onClick={() => onSelect(t)}
                className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col gap-3 transition-all hover:border-gray-400 hover:bg-gray-800 cursor-pointer"
            >
                <h3 className="text-white font-semibold">{t.name}</h3>
                <p className="text-gray-400 text-sm flex-1">{t.description}</p>
                <button className="mt-1 bg-white text-gray-900 text-sm font-medium rounded-lg px-4 py-2 hover:bg-gray-200 self-start">
                    SELECT
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-16">
            <section className="text-center py-10">
                <h1 className="text-5xl font-bold text-white mb-4">AI Prompt Engineering Studio</h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-normal">
                    Writing prompts is difficult. Most people just type random things, but this
                    tool helps you organize your ideas into sections so the AI gives better answers.
                </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-800 pt-12">
                <div>
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">The Main Problem</h2>
                    <p className="text-white mb-4">
                        Normal prompts are usually messy. This leads to wrong information and bad
                        formatting. If you do not tell the AI exactly what its job is, it just gives
                        generic responses that are not very helpful for engineering or class work.
                    </p>
                    <p className="text-white mb-4">
                        Another issue is consistency. Without a template, you cannot get the same
                        result twice. This makes it impossible to use AI for professional tasks
                        where you need a specific format or logic every single time the prompt is run.
                    </p>
                    <p className="text-white mb-4">
                        Finally, vague instructions often lead to the AI ignoring important rules.
                        When constraints are buried in long paragraphs, the model often misses
                        technical details like time complexity or specific language requirements.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">What We Do</h2>
                    {/* render the feature boxes */}
                    {featureList}
                </div>
            </div>

            <section className="pt-12">
                <h2 className="text-2xl font-bold text-white mb-8">Pick a Category</h2>

                {/* template cards go here */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cardList}
                </div>
            </section>
        </div>
    );
}
