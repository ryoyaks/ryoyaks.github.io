import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import {
  About,
  Contact,
  Footer,
  Hero,
  Loader,
  NavBar,
  Projects,
  Sidebar,
  TechStack,
  Linktree
} from "./sections";

const MainContent = () => (
  <>
    <NavBar />
    {/* <Loader /> */}
    <Sidebar />
    <Hero />
    <Linktree />
    <About />
    <TechStack />
    <Projects />
    <Contact />
    <Footer />
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
