import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import { Hero, NavBar, Sidebar, Linktree } from "./sections";

const Bento = lazy(() => import("./sections/Bento"));
const SyncRig = lazy(() => import("./sections/SyncRig"));
const Footer = lazy(() => import("./components/Footer"));

const MainContent = () => (
  <>
    <NavBar />
    <Sidebar />
    <Hero />
    <Linktree />
    <Suspense fallback={null}>
      <Bento />
      <Footer />
    </Suspense>
  </>
);

const SyncRigPage = () => (
  <>
    <NavBar />
    <Sidebar />
    <Suspense fallback={null}>
      <SyncRig />
      <Footer />
    </Suspense>
  </>
);

const App = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/projects/syncrig" element={<SyncRigPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
