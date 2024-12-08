import { Button, Offcanvas, Stack } from "react-bootstrap";
import {
  CartItem as CartItemType,
  useShoppingCart,
} from "../context/ShoppingCartContext";
import { CartItem } from "./CartItem";
import { formatCurrency } from "../utilities/formatCurrency";
import storeItems from "../data/items.json";
import { useNavigate } from "react-router-dom";

type ShoppingCartProps = {
  isOpen: boolean;
};

export function ShoppingCart({ isOpen }: ShoppingCartProps) {
  const { closeCart, cartItems, toggleLoading, getAddOnTotal, termsAccepted } =
    useShoppingCart();

  const navigate = useNavigate();

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
      if (termsAccepted) {
        toggleLoading();
        goToCheckoutLink();
      } else if (!termsAccepted) {
        closeCart();
        navigate("/terms-and-conditions");

        setTimeout(() => {
          alert("Please accept Terms and Conditions to continue");
        }, 0);
      }
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
        <Stack gap={4}>
          {cartItems.map((item) => (
            <CartItem key={item.id} {...item} />
          ))}
          <div
            className="ms-auto fw-bold fs-4 d-flex align-items-center justify-content-center flex-column"
            style={{ marginTop: "0.25rem" }}
          >
            {cartItems.length > 0 && (
              <span
                style={{
                  opacity: "0.77",
                  fontWeight: "300",
                  fontSize: "0.77em",
                  marginBottom: "0.3rem",
                  letterSpacing: "0.2px",
                }}
                className="ms-auto"
              >
                <span style={{ fontSize: "0.9em" }}>+</span>$8.10 Shipping
              </span>
            )}
            <span>
              <span style={{ opacity: "0.9", fontWeight: "500" }}>Total</span>
              <span
                style={{
                  color: "rgb(25, 135, 84)",
                  fontSize: "1.1em",
                  marginLeft: "0.25em",
                }}
              >
                {cartItems.length > 0
                  ? formatCurrency(
                      cartItems.reduce((total, cartItem) => {
                        return formatTotal(total, cartItem);
                      }, 0) +
                        getAddOnTotal() +
                        8.1
                    )
                  : "$0.00"}
              </span>
            </span>
          </div>
          <Button onClick={processCheckout} style={{ fontSize: "1.25rem" }}>
            Checkout
          </Button>
        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

function formatTotal(total: number, cartItem: CartItemType) {
  const item = storeItems.find((i) => i.id === Number(String(cartItem.id)[0]));

  let veryGoodPrice = 0;

  switch (cartItem.quantity) {
    case 1:
      veryGoodPrice = Number(item?.prices["1"]);
      break;
    case 4:
      veryGoodPrice = Number(item?.prices["4"]);
      break;
    case 6:
      veryGoodPrice = Number(item?.prices["6"]);
      break;
    case 8:
      veryGoodPrice = Number(item?.prices["8"]);
      break;
    case 10:
      veryGoodPrice = Number(item?.prices["10"]);
      break;
  }

  if (Number(String(cartItem.id)[0]) === 6) {
    return (
      total +
      (item?.prices as unknown as { [key: string]: number })[cartItem.quantity]
    );
  }

  return total + (veryGoodPrice || 0);
}
