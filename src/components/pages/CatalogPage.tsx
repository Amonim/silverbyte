import { useEffect } from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import CatalogSection from "../sections/CatalogSection";
import { markCatalogOpened } from "../../utils/profile";

function CatalogPage() {
  useEffect(() => {
    markCatalogOpened();
  }, []);

  return (
    <>
      <Header />
      <CatalogSection />
      <Footer />
    </>
  );
}

export default CatalogPage;