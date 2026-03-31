import { Routes, Route, Navigate } from 'react-router-dom'
import LawEnforcementInteraction from './components/LawEnforcementInteraction'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/vehicle" replace />} />
      <Route path="/:section" element={<LawEnforcementInteraction />} />
      <Route path="/:section/:step" element={<LawEnforcementInteraction />} />
    </Routes>
  )
}

export default App
