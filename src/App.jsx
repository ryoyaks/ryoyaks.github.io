import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import PageTransition from "./components/PageTransition";
import { NavBar } from "./sections";

// Hero 帶進整個 three.js／R3F。必須 lazy，否則 /links 也會下載 3D。
const Hero = lazy(() => import("./sections/Hero"));
const Links = lazy(() => import("./pages/Links"));
const Bento = lazy(() => import("./sections/Bento"));
const SyncRig = lazy(() => import("./sections/SyncRig"));
const Footer = lazy(() => import("./components/Footer"));

// eslint-disable-next-line react/prop-types -- prop-types isn't used anywhere in this codebase
const Shell = ({ children }) => (
  <>
    <NavBar />
    <Suspense fallback={null}>
      {children}
      <Footer />
    </Suspense>
  </>
);

// eslint-disable-next-line react/prop-types -- prop-types isn't used anywhere in this codebase
export const AppRoutes = ({ location }) => (
  <Routes location={location}>
    <Route
      path="/"
      element={
        <Shell>
          <Hero />
          <Bento />
        </Shell>
      }
    />
    <Route
      path="/links"
      element={
        <Shell>
          <Links />
        </Shell>
      }
    />
    <Route
      path="/projects/syncrig"
      element={
        <Shell>
          <SyncRig />
        </Shell>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <Router>
    <div className="min-h-screen">
      <PageTransition>
        {(location) => <AppRoutes location={location} />}
      </PageTransition>
    </div>
  </Router>
);

export default App;
