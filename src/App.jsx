import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import { Hero, NavBar, Sidebar, Linktree } from "./sections";

const About = lazy(() => import("./sections/About"));
const TechStack = lazy(() => import("./sections/TechStack"));
const Projects = lazy(() => import("./sections/Projects"));
const Contact = lazy(() => import("./sections/Contact"));
const Footer = lazy(() => import("./components/Footer"));

const MainContent = () => (
  <>
    <NavBar />
    <Sidebar />
    <Hero />
    <Linktree />
    <Suspense fallback={null}>
      <About />
      <TechStack />
      <Projects />
      <Contact />
      <Footer />
    </Suspense>
  </>
);

const App = () => {
  return (
    <Router>
      <div className="bg-black-100">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
