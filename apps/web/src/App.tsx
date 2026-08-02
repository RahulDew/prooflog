import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";
import { SmoothCursor } from "./components/SmoothCursor";
import { SmoothScroll } from "./components/SmoothScroll";

// Lazy load pages for maximum performance (Code Splitting)
const Home = lazy(() => import("./pages/Home"));
const Docs = lazy(() => import("./pages/Docs"));
const Verification = lazy(() => import("./pages/Verification"));
const Changelog = lazy(() => import("./pages/Changelog"));
const About = lazy(() => import("./pages/About"));

// A lightweight fallback while pages load
const PageLoader = () => (
  <div className="pt-24 min-h-screen flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-orange-500/20 border-t-orange-500 rounded-[4px] animate-spin"></div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <SmoothScroll>
          <SmoothCursor />
          <BrowserRouter>
            <div className="min-h-screen font-sans selection:bg-orange-500 selection:text-white overflow-x-clip">
              <Navbar />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/docs/*" element={<Docs />} />
                  <Route path="/verification" element={<Verification />} />
                  <Route path="/changelog" element={<Changelog />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </Suspense>
              <Footer />
            </div>
          </BrowserRouter>
        </SmoothScroll>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
