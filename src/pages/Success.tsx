import { useEffect } from "react";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { Button } from "react-bootstrap";

export function Success() {
  const { clearCart } = useShoppingCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1.5rem",
        minHeight: "70vh",
      }}
    >
      <h1
        style={{
          margin: "1.25rem 0",
          fontFamily: "Lobster",
          letterSpacing: "0.5px",
        }}
      >
        Your payment was successful!
      </h1>
      <Button href="/">Back to Shop</Button>
    </div>
  );
}
