import * as Sentry from "@sentry/react";

import "./App.css";
import Navbar from "./components/Navbar";
import Highlights from "./components/Highlights";
import Hero from "./components/Hero";
import Model from "./components/Model";
import Features from "./components/Features";
import Chip from "./components/Chip";
import Footer from "./components/Footer";

function App() {
  return (
    <main className="bg-black overflow-y-auto">
      <Navbar />
      <Hero />
      <Highlights />
      <Model />
      <Features />
      <Chip />
      <Footer />
    </main>
  );
}

//export default App;

export default Sentry.withProfiler(App);
