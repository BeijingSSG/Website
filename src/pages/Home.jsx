import { useEffect } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Hero from "../sections/Hero";
import About from "../sections/About";
import GameIntel from "../sections/GameIntel";
import StrategyBoard from "../sections/StrategyBoard";
import Roster from "../sections/Roster";

export default function Home() {
  useEffect(() => {
    document.title = "SuperSonicCenter";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <About />
      <GameIntel />
      <StrategyBoard />
      <Roster />
      <Footer />
    </div>
  );
}
