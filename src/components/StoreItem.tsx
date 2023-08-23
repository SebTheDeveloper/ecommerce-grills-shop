import { Button, Card, Form } from "react-bootstrap";
import { formatCurrency } from "../utilities/formatCurrency";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { useEffect, useRef, useState } from "react";

type StoreItemProps = {
  id: number;
  name: string;
  prices: {
    [key: string]: number;
  };
  imgUrl: string;
};

export function StoreItem({ id, name, prices, imgUrl }: StoreItemProps) {
  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    setCartQuantity,
    removeFromCart,
  } = useShoppingCart();
  const quantity = getItemQuantity(id);

  return (
    <Card
      className="h-100"
      style={{
        animation: "fade-in 0.3s ease-in-out",
        border: quantity > 0 ? "1px solid gold" : "1px solid grey",
        borderRadius: "0.5rem",
        overflow: "hidden",
        boxShadow: quantity > 0 ? "0 0 8px gold" : "",
      }}
      onMouseOver={() => null}
    >
      <Card.Img
        variant="top"
        src={imgUrl}
        height="200px"
        style={{ objectFit: "cover" }}
      />
      <Card.Body
        className="d-flex flex-column"
        style={{
          backgroundColor: "rgb(10, 10, 10)",
          color: "rgb(240, 240, 240)",
          paddingBottom: "1.5rem",
        }}
      >
        <Card.Title className="d-flex justify-content-between flex-column align-items-baseline mb-4">
          <span className="fs-4" style={{ fontWeight: "500" }}>
            {name}
          </span>
          <Form.Select
            className="fs-6"
            value={quantity}
            size="lg"
            style={{
              opacity: "0.9",
              margin: "1em 0",
              border: quantity > 0 ? "1px solid gold" : "none",
              cursor: "pointer",
              backgroundColor: "rgb(240,240,240)",
              padding: "0.25em",
            }}
            onChange={(e) => setCartQuantity(id, Number(e.target.value))}
          >
            <option value="0">
              {quantity > 0 ? "Remove From Cart" : "See Prices"}
            </option>
            <option value="1">1 for {formatCurrency(prices["1"])}</option>
            <option value="6">6 for {formatCurrency(prices["6"])}</option>
            <option value="8">8 for {formatCurrency(prices["8"])}</option>
            <option value="10">10 for {formatCurrency(prices["10"])}</option>
          </Form.Select>
        </Card.Title>
        <div className="mt-auto">
          {quantity === 0 ? (
            <AddToCartButton
              id={id}
              increaseCartQuantity={increaseCartQuantity}
            />
          ) : (
            <div
              style={{ gap: "0.5rem" }}
              className="d-flex align-items-center flex-column fade-in"
            >
              <div
                style={{ gap: "0.5rem", marginBottom: "0.25em" }}
                className="d-flex align-items-center justify-content-center"
              >
                <Button
                  variant="primary"
                  onClick={() => {
                    decreaseCartQuantity(id);
                  }}
                >
                  -
                </Button>
                <div>
                  <span className="fs-3">{quantity}</span> in cart
                </div>
                <Button
                  variant="primary"
                  onClick={() => {
                    increaseCartQuantity(id);
                  }}
                >
                  +
                </Button>
              </div>
              <Button
                onClick={() => {
                  removeFromCart(id);
                }}
                variant="danger"
                size="sm"
              >
                {" "}
                Remove
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

type Props = {
  id: number;
  increaseCartQuantity: (id: number) => void;
};

function AddToCartButton({ id, increaseCartQuantity }: Props) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const button = buttonRef.current;

    const handleAnimationEnd = () => {
      setIsComplete(true);
      increaseCartQuantity(id);
    };

    if (button) {
      button.addEventListener("animationend", handleAnimationEnd);
    }

    return () => {
      if (button) {
        button.removeEventListener("animationend", handleAnimationEnd);
      }
    };
  }, []);

  const handleButtonClick = () => {
    setIsAnimating(true);
  };

  if (isComplete) return null;

  return (
    <Button
      className={`w-100 ${isAnimating ? "fade-out" : ""}`}
      onClick={handleButtonClick}
      ref={buttonRef}
    >
      + Add to Cart
    </Button>
  );
}
