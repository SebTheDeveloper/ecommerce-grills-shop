import { Button, Offcanvas, Stack } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { CartItem } from "./CartItem";
import { formatCurrency } from "../utilities/formatCurrency";
import storeItems from "../data/items.json";

type ShoppingCartProps = {
  isOpen: boolean;
};

export function ShoppingCart({ isOpen }: ShoppingCartProps) {
  const { closeCart, cartItems } = useShoppingCart();

  async function goToCheckoutLink(): Promise<void> {
    if (cartItems.length > 0) {
      try {
        const response = await fetch("/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cartItems,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          location.href = data.url;
        } else {
          const err = await response.json();
          throw new Error(err.error || "Error fetching checking session");
        }
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        } else {
          console.log(e);
        }
      }
    }
  }

  return (
    <Offcanvas
      show={isOpen}
      placement="end"
      onHide={closeCart}
      style={{ backgroundColor: "rgb(240,240,240)", color: "rgb(5,5,5)" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Stack gap={3}>
          {cartItems.map((item) => (
            <CartItem key={item.id} {...item} />
          ))}
          <div className="ms-auto fw-bold fs-5">
            Total{" "}
            {formatCurrency(
              cartItems.reduce((total, cartItem) => {
                const item = storeItems.find((i) => i.id === cartItem.id);
                return total + (item?.prices["1"] || 0) * cartItem.quantity;
              }, 0)
            )}
          </div>
          <Button onClick={goToCheckoutLink}>Checkout</Button>
        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
