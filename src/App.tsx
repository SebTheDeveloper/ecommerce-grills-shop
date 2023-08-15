import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Store } from "./pages/Store";
import { About } from "./pages/About";
import { Navbar } from "./components/Navbar";
import { ShoppingCartProvider } from "./context/ShoppingCartContext";
import { Success } from "./pages/Success";
// import { Footer } from './components/Footer'

export default function App() {
  return (
    <ShoppingCartProvider>
      <Navbar />
      <Container className="mb-4">
        <Routes>
          <Route path="/" element={<Store />} />
          <Route path="/about" element={<About />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </Container>
      {/* <Footer /> */}
    </ShoppingCartProvider>
  );
}
