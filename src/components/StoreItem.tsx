import { Button, Card, Form } from "react-bootstrap";
import { formatCurrency } from "../utilities/formatCurrency";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { useEffect, useRef, useState } from "react";
import { AddOn } from "./AddOn";

export type StoreItemProps = {
  id: number;
  name: string;
  prices: {
    [key: string]: number;
  };
  imgUrl: string;
};

export function StoreItem({ id, name, prices, imgUrl }: StoreItemProps) {
  const { getItemQuantity, getMultiItem } = useShoppingCart();
  const quantity = getItemQuantity(id);
  const multiItemList = getMultiItem(id);

  return (
    <Card
      className="h-100"
      style={{
        animation: "fade-in 0.3s ease-in-out",
        border:
          multiItemList && multiItemList.length > 0
            ? "1px solid gold"
            : "1px solid grey",
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
        <ItemPiece
          id={id}
          name={name}
          quantity={quantity}
          prices={prices}
          isMultiItem={
            multiItemList && String(multiItemList[0]).length > 1 ? true : false
          }
          isLastItem={multiItemList && multiItemList.length > 1 ? false : true}
        />
        {multiItemList &&
          multiItemList.map((item, index) => {
            if (item.id !== id) {
              return (
                <ItemPiece
                  key={item.id}
                  id={item.id}
                  name={name}
                  quantity={item.quantity}
                  prices={prices}
                  isMultiItem={true}
                  isLastItem={index === multiItemList.length - 1 ? true : false}
                />
              );
            }
          })}
      </Card.Body>
    </Card>
  );
}

type AddToCartButtonProps = {
  id: number;
  teethQuantity: number;
  isMultiItem: boolean;
  increaseItemToothQuantity: (id: number) => void;
};

function AddToCartButton({
  id,
  teethQuantity,
  isMultiItem,
  increaseItemToothQuantity,
}: AddToCartButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const button = buttonRef.current;

    const handleAnimationEnd = () => {
      setIsAnimating(false);
      increaseItemToothQuantity(id);
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

  if (teethQuantity > 0 || !isMultiItem) {
    return (
      <Button
        className={`w-100 ${isAnimating && "fade-out"}`}
        onClick={handleButtonClick}
        ref={buttonRef}
      >
        + Add to Cart
      </Button>
    );
  }
}

type ItemPieceProps = {
  id: StoreItemProps["id"];
  name: StoreItemProps["name"];
  quantity: number;
  prices: StoreItemProps["prices"];
  isMultiItem: boolean;
  isLastItem: boolean;
};

function ItemPiece({
  id,
  name,
  quantity,
  prices,
  isLastItem,
  isMultiItem,
}: ItemPieceProps) {
  const {
    getSelectedAddOns,
    createMultiItem,
    increaseItemToothQuantity,
    decreaseItemToothQuantity,
    getAggregateItemQuantity,
    setCartQuantity,
    removeFromCart,
  } = useShoppingCart();
  const selectedAddOns = getSelectedAddOns(id);
  const aggregateQuantity = getAggregateItemQuantity(id);
  // const [isRemoving, setIsRemoving] = useState(false);

  const processRemoveItem = () => {
    // setIsRemoving(true);
    removeFromCart(id);
    // setIsRemoving(false);
  };

  return (
    <>
      <Card.Title
        className="d-flex justify-content-between flex-column align-items-baseline mb-4"
        style={{
          borderTop:
            aggregateQuantity > 1 && String(id).length > 1
              ? "1px solid rgba(0,0,0,0.8)"
              : "none",
        }}
      >
        {String(id).length <= 1 && (
          <>
            <span className="fs-4" style={{ fontWeight: "500" }}>
              {name}
            </span>
            {aggregateQuantity > 0 && (
              <span
                className="fs-6 mt-1"
                style={{ fontWeight: "300", opacity: "0.7", color: "gold" }}
              >
                {aggregateQuantity}{" "}
                {aggregateQuantity > 1 ? "items in cart" : "item in cart"}
              </span>
            )}
          </>
        )}
        {(quantity > 0 || aggregateQuantity === 0) && (
          <Form.Select
            key={quantity}
            value={quantity}
            size="lg"
            id="form-select-animation"
            style={{
              opacity: "0.9",
              margin: "1.75em 0",
              border: aggregateQuantity > 0 ? "1px solid gold" : "none",
              cursor: "pointer",
              backgroundColor: "rgb(240,240,240)",
              padding: "0.25em",
            }}
            onChange={(e) => setCartQuantity(id, Number(e.target.value))}
          >
            {name === "Mold Kit" ? (
              <>
                <option value="0">
                  {quantity > 0 ? "Remove From Cart" : "See Prices"}
                </option>
                <option value="1">
                  Mold Kit - Top Only {formatCurrency(prices["1"])}
                </option>
                <option value="2">
                  Mold Kit - Bottom Only {formatCurrency(prices["2"])}
                </option>
                <option value="3">
                  Mold Kit - Top & Bottom {formatCurrency(prices["3"])}
                </option>
              </>
            ) : (
              <>
                <option value="0">
                  {quantity > 0 ? "Remove From Cart" : "See Prices"}
                </option>
                <option value="1">
                  1 tooth for {formatCurrency(prices["1"])}
                </option>
                <option value="6">
                  6 teeth for {formatCurrency(prices["6"])}
                </option>
                <option value="8">
                  8 teeth for {formatCurrency(prices["8"])}
                </option>
                <option value="10">
                  10 teeth for {formatCurrency(prices["10"])}
                </option>
              </>
            )}
          </Form.Select>
        )}
        {name !== "Mold Kit" &&
          quantity > 0 &&
          ["Open Face", "Diamond Dust", "Chipped Tooth", "Missing Tooth"].map(
            (addOn, index) => <AddOn id={id} addOn={addOn} key={index} />
          )}
      </Card.Title>
      <div
        className="mt-auto"
        style={{ animation: "grow-in 0.8s ease-in-out" }}
      >
        {quantity === 0 && !isMultiItem ? (
          <AddToCartButton
            id={id}
            teethQuantity={quantity}
            isMultiItem={isMultiItem}
            increaseItemToothQuantity={increaseItemToothQuantity}
          />
        ) : (
          name !== "Mold Kit" &&
          quantity > 0 && (
            <div
              style={{ gap: "0.5rem", animation: "grow-in 0.8s ease-in-out" }}
              className="d-flex align-items-center flex-column fade-in"
            >
              <div
                style={{ gap: "0.5rem", marginBottom: "0.25em" }}
                className="d-flex align-items-center justify-content-center"
              >
                <Button
                  variant="primary"
                  onClick={() => {
                    decreaseItemToothQuantity(id);
                  }}
                >
                  -
                </Button>
                <div id="form-select-animation" key={quantity}>
                  <span className="fs-3">x{quantity}</span>{" "}
                  {quantity > 1 ? "teeth" : "tooth"}
                </div>
                <Button
                  variant="primary"
                  onClick={() => {
                    increaseItemToothQuantity(id);
                  }}
                >
                  +
                </Button>
              </div>
              {selectedAddOns && (
                <div
                  id="form-select-animation"
                  key={selectedAddOns.length}
                  style={{
                    border:
                      selectedAddOns.length > 0
                        ? "1px solid gold"
                        : "1px solid transparent",
                    borderRadius: "7px",
                    padding: "0.4em 0.8em",
                    margin: "0.7rem",
                    fontSize: "0.95em",
                    boxShadow:
                      selectedAddOns.length > 0
                        ? "0 0 4px gold"
                        : "0 0 4px rgb(240, 240, 240)",
                    opacity: selectedAddOns.length > 0 ? "0.9" : "0.7",
                  }}
                >
                  {selectedAddOns.length} add-on
                  {selectedAddOns.length !== 1 && "s"} selected
                  {selectedAddOns.length > 0 && (
                    <span
                      className="d-flex flex-column justify-content-center"
                      style={{
                        fontSize: "0.8em",
                        opacity: "0.9",
                        padding: "0.25em 0",
                      }}
                    >
                      {selectedAddOns.map((addOn, index) => (
                        <span key={index}>
                          •{" "}
                          {`${addOn.name
                            .replace(/-/g, " ")
                            .replace(/\b\w/g, (char) => char.toUpperCase())
                            .toString()}: $${addOn.price}`}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        )}
        {quantity > 0 && (
          <span
            className="mt-3 d-flex align-items-center justify-content-center gap-2"
            style={{ animation: "grow-in 0.8s ease-in-out" }}
          >
            {isLastItem && (
              <>
                {name !== "Mold Kit" && (
                  <>
                    <Button
                      onClick={() => {
                        createMultiItem(id);
                      }}
                      variant="outline-secondary"
                      size="sm"
                    >
                      + Add another item
                    </Button>
                    or
                  </>
                )}
                <Button onClick={processRemoveItem} variant="danger" size="sm">
                  {" "}
                  Remove
                </Button>
              </>
            )}
          </span>
        )}
      </div>
    </>
  );
}
