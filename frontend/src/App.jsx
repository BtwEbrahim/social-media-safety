import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Trackers from './pages/Trackers'
import Safety from './pages/Safety'
import Footprint from './pages/Footprint'
import Security from './pages/Security'

// Loaded only on /schedule so supabase-js stays out of the main bundle.
const Schedule = lazy(() => import('./pages/Schedule'))

export default function App() {
  return (
    <div className="min-h-screen relative">
      {/* Fixed light behind everything. Aria-hidden: purely visual. */}
      <div className="aurora" aria-hidden="true">
        <span className="blob blob-blue" />
        <span className="blob blob-cyan" />
        <span className="blob blob-purple" />
        <span className="blob blob-pink" />
      </div>
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main className="relative z-10">
        <Suspense fallback={<p className="max-w-5xl mx-auto px-6 pt-24 font-data text-sm text-paper-dim">Loading</p>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trackers" element={<Trackers />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/footprint" element={<Footprint />} />
            <Route path="/security" element={<Security />} />
            <Route path="/schedule" element={<Schedule />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="relative z-10 max-w-5xl mx-auto px-6 pb-10 pt-4 text-sm text-paper-dim">
        A college CEP project. Everything interactive here runs in your browser; nothing you type or upload leaves it.
      </footer>
    </div>
  )
}
