import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'

// Lazy load pages for maximum performance (Code Splitting)
const Home = lazy(() => import('./pages/Home'))
const Docs = lazy(() => import('./pages/Docs'))
const Verification = lazy(() => import('./pages/Verification'))
const Changelog = lazy(() => import('./pages/Changelog'))

// A lightweight fallback while pages load
const PageLoader = () => (
  <div className="pt-24 min-h-screen flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark-bg text-gray-50 font-sans selection:bg-indigo-500/30 selection:text-white overflow-x-hidden">
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/docs/*" element={<Docs />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/changelog" element={<Changelog />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  )
}

export default App
