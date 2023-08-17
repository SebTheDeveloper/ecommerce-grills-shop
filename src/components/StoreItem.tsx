import { Button, Card } from "react-bootstrap";
import { formatCurrency } from "../utilities/formatCurrency";
import { useShoppingCart } from "../context/ShoppingCartContext";

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
        border: quantity > 0 ? "1px solid gold" : "1px solid white",
        boxShadow: quantity > 0 ? "0 0 8px gold" : "",
      }}
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
          backgroundColor: "rgb(8, 8, 8)",
          color: "rgb(240, 240, 240)",
        }}
      >
        <Card.Title className="d-flex justify-content-between align-items-baseline mb-4">
          <span className="fs-4">{name}</span>
          <select
            className="fs-6"
            value={quantity}
            style={{ opacity: "0.9" }}
            onChange={(e) => setCartQuantity(id, Number(e.target.value))}
          >
            <option value="0">Select Quantity</option>
            <option value="1">1 for {formatCurrency(prices["1"])}</option>
            <option value="6">6 for {formatCurrency(prices["6"])}</option>
            <option value="8">8 for {formatCurrency(prices["8"])}</option>
            <option value="10">10 for {formatCurrency(prices["10"])}</option>
          </select>
        </Card.Title>
        <div className="mt-auto">
          {quantity === 0 ? (
            <Button
              className="w-100"
              onClick={() => {
                increaseCartQuantity(id);
              }}
            >
              + Add to Cart
            </Button>
          ) : (
            <div
              style={{ gap: "0.5rem" }}
              className="d-flex align-items-center flex-column"
            >
              <div
                style={{ gap: "0.5rem" }}
                className="d-flex align-items-center justify-content-center"
              >
                <Button
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
