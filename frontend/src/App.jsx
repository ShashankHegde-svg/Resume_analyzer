import { useState } from 'react'
import StarBackground from './components/StarBackground'
import UploadScreen from './components/UploadScreen'
import Dashboard from './components/Dashboard'

export default function App() {
  const [result, setResult] = useState(null)

  return (
    <div className="app-wrapper">
      <StarBackground />
      {result
        ? <Dashboard data={result} onReset={() => setResult(null)} />
        : <UploadScreen onResult={setResult} />
      }
    </div>
  )
}