import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Trackers from './pages/Trackers'
import Safety from './pages/Safety'
import Footprint from './pages/Footprint'
import Security from './pages/Security'

export default function App() {
  return (
    <div className="min-h-screen relative">
      <div className="grain" />
      <Nav />
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trackers" element={<Trackers />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/footprint" element={<Footprint />} />
          <Route path="/security" element={<Security />} />
        </Routes>
      </main>
    </div>
  )
}
