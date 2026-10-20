import { useState } from 'react'
import Layout from './components/Layout'
import Home from './components/Home'
import PromptBuilder from './components/PromptBuilder'
import ConfigValidation from './components/ConfigValidation'
import FinalOutput from './components/FinalOutput'
import templates from './data/templates.json'

export default function App() {
    const [view, setView] = useState('home')
    const [template, setTemplate] = useState(null)
    const [sections, setSections] = useState([])
    const [config, setConfig] = useState({ tone: '', verbosity: '', outputFormat: '' })

    // Selects a secton
    const handleSelect = (t) => {
        setTemplate(t)
        setSections(t.requiredSections.map(id => ({ sectionId: id, fields: {} })))
        setConfig({ tone: '', verbosity: '', outputFormat: '' })
        setView('builder')
    }

    // Resets all the data for good
    const handleReset = () => {
        setTemplate(null)
        setSections([])
        setConfig({ tone: '', verbosity: '', outputFormat: '' })
        setView('home')
    }

    return (
        <Layout view={view} onReset={handleReset}>
            {view === 'home' && <Home templates={templates} onSelect={handleSelect} />}
            {view === 'builder' && (<PromptBuilder template={template} sections={sections} setSections={setSections} setView={setView} />)}
            {view === 'config' && (<ConfigValidation template={template} sections={sections} config={config} setConfig={setConfig} setView={setView} />)}
            {view === 'output' && (<FinalOutput template={template} sections={sections} config={config} setView={setView} handleReset={handleReset} />)}
        </Layout>
    )
}