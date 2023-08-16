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
      <h1>Your payment was successful!</h1>
      <Button href="/">Back to Shop</Button>
    </>
  );
}
