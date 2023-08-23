import { useEffect } from "react";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { Button } from "react-bootstrap";

export function Success() {
  const { clearCart } = useShoppingCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <>
      <h1
        style={{
          margin: "1.25rem 0",
        }}
      >
        Your payment was successful!
      </h1>
      <Button href="/">Back to Shop</Button>
    </>
  );
}
