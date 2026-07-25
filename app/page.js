import BackgroundCanvas from "../components/BackgroundCanvas";
import Sparkles from "../components/Sparkles";
import Hero from "../components/Hero";
import Trivia from "../components/Trivia";
import Gallery from "../components/Gallery";
import MapSection from "../components/MapSection";
import RSVP from "../components/RSVP";
import PhotoUpload from "../components/PhotoUpload";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <BackgroundCanvas />
      <Sparkles />
      <main className="relative z-10 pt-8 pb-20 px-gutter max-w-md mx-auto flex flex-col gap-stack-lg">
        <Hero />
        <RSVP />
        <Trivia />
        <Gallery />
        <MapSection />
        <PhotoUpload />
        <Footer />
      </main>
    </>
  );
}
