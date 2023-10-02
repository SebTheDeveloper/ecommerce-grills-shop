import { About } from "./pages/About";
import { Container } from "react-bootstrap";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { Store } from "./pages/Store";
import { Success } from "./pages/Success";
import { TermsAndConditions } from "./pages/TermsAndConditions";
import { Routes, Route } from "react-router-dom";
import { useShoppingCart } from "./context/ShoppingCartContext";

export default function App() {
  const { isLoading } = useShoppingCart();

  return (
    <>
      <div className={isLoading ? `loading-circle` : ""}>
        <div className={isLoading ? `load-wheel` : ""}></div>
      </div>
      <Navbar />
      <Container className="mb-4">
        <Routes>
          <Route path="/" element={<Store />} />
          <Route path="/about" element={<About />} />
          <Route path="/success" element={<Success />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
        </Routes>
      </Container>
      <Footer />
    </>
  );
}
