import { useEffect } from "react";
import { useShoppingCart } from "../context/ShoppingCartContext";

export function Success() {
  const { clearCart } = useShoppingCart();

  useEffect(() => {
    clearCart();
  }, []);

  return <h1>Success</h1>;
}
