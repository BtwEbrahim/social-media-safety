import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Trackers from './pages/Trackers'
import Safety from './pages/Safety'
import Footprint from './pages/Footprint'
import Security from './pages/Security'
import Quiz from './pages/Quiz'
import Schedule from './pages/Schedule'

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trackers" element={<Trackers />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/footprint" element={<Footprint />} />
          <Route path="/security" element={<Security />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/schedule" element={<Schedule />} />
        </Routes>
      </main>
    </div>
  )
}
