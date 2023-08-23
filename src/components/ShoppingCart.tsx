import { Button, Offcanvas, Stack } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { CartItem } from "./CartItem";
import { formatCurrency } from "../utilities/formatCurrency";
import storeItems from "../data/items.json";

type ShoppingCartProps = {
  isOpen: boolean;
};

export function ShoppingCart({ isOpen }: ShoppingCartProps) {
  const { closeCart, cartItems, toggleLoading } = useShoppingCart();

  async function goToCheckoutLink(): Promise<void> {
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

  function processCheckout() {
    if (cartItems.length > 0) {
      toggleLoading();
      goToCheckoutLink();
    }
  }

  return (
    <Offcanvas
      show={isOpen}
      placement="end"
      onHide={closeCart}
      style={{
        backgroundColor: "rgba(30, 30, 30, 0.95)",
        color: "rgb(250,250,250)",
      }}
    >
      <Offcanvas.Header closeButton closeVariant={"white"}>
        <Offcanvas.Title>Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Stack gap={3}>
          {cartItems.map((item) => (
            <CartItem key={item.id} {...item} />
          ))}
          <div
            className="ms-auto fw-bold fs-4"
            style={{ marginTop: "0.25rem" }}
          >
            Total{" "}
            {formatCurrency(
              cartItems.reduce((total, cartItem) => {
                const item = storeItems.find((i) => i.id === cartItem.id);
                return total + (item?.prices["1"] || 0) * cartItem.quantity;
              }, 0)
            )}
          </div>
          <Button onClick={processCheckout} style={{ fontSize: "1.25rem" }}>
            Checkout
          </Button>
        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
