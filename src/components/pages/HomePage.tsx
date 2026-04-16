import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Hero from "../home/Hero";
import Features from "../home/Features";
import PopularProducts from "../home/PopularProducts";
import ChatBotSection from "../home/ChatBot";

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <PopularProducts />
      <Footer />
      <ChatBotSection />
    </>
  );
}

export default Home;
