import { Button, Card, Form } from "react-bootstrap";
import { formatCurrency } from "../utilities/formatCurrency";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { useEffect, useRef, useState } from "react";
import { AddOn } from "./AddOn";

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
    getSelectedAddOns,
    increaseCartQuantity,
    decreaseCartQuantity,
    setCartQuantity,
    removeFromCart,
  } = useShoppingCart();
  const quantity = getItemQuantity(id);
  const selectedAddOns = getSelectedAddOns(id);

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
            key={quantity}
            value={quantity}
            size="lg"
            id={"form-select-animation"}
            style={{
              opacity: "0.9",
              margin: "1.75em 0",
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
          {quantity > 0 &&
            ["Open Face", "Diamond Dust", "Chipped Tooth", "Missing Tooth"].map(
              (addOn, index) => <AddOn id={id} addOn={addOn} key={index} />
            )}
        </Card.Title>
        <div className="mt-auto">
          {quantity === 0 ? (
            <AddToCartButton
              id={id}
              increaseCartQuantity={increaseCartQuantity}
              quantity={quantity}
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
              {selectedAddOns && (
                <div
                  id={"form-select-animation"}
                  key={selectedAddOns.length}
                  style={{
                    border:
                      selectedAddOns.length > 0
                        ? "1px solid gold"
                        : "1px solid transparent",
                    borderRadius: "7px",
                    padding: "0.1em 0.3em",
                    margin: "0.7rem",
                    fontSize: "0.95em",
                    boxShadow:
                      selectedAddOns.length > 0
                        ? "0 0 4px gold"
                        : "0 0 4px rgb(240, 240, 240)",
                    opacity: "0.9",
                  }}
                >
                  {selectedAddOns.length} add-ons selected
                </div>
              )}
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

type AddToCartButtonProps = {
  id: number;
  quantity: number;
  increaseCartQuantity: (id: number) => void;
};

function AddToCartButton({
  id,
  increaseCartQuantity,
  quantity,
}: AddToCartButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const button = buttonRef.current;

    const handleAnimationEnd = () => {
      setIsAnimating(false);
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

  return (
    <>
      {quantity === 0 && (
        <Button
          className={`w-100 ${isAnimating && "fade-out"}`}
          onClick={handleButtonClick}
          ref={buttonRef}
        >
          + Add to Cart
        </Button>
      )}
    </>
  );
}
