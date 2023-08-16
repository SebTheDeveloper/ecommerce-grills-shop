import { Button, Stack } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import storeItems from "../data/items.json";
import { formatCurrency } from "../utilities/formatCurrency";

type CartItemProps = {
  id: number;
  quantity: number;
};

export function CartItem({ id, quantity }: CartItemProps) {
  const { removeFromCart } = useShoppingCart();
  const item = storeItems.find((i) => i.id === id);
  if (item == null) return null;

  return (
    <Stack
      direction="horizontal"
      gap={2}
      style={{ fontSize: "1.25rem" }}
      className="d-flex align-items-center"
    >
      <img
        src={item.imgUrl}
        style={{
          width: "125px",
          height: "75px",
          objectFit: "cover",
          borderRadius: "5px",
          boxShadow: "1px 1px 8px rgba(0,0,0,0.5)",
        }}
      />
      <div className="me-auto">
        <div>
          {item.name}{" "}
          {quantity > 1 && (
            <span style={{ fontSize: "0.95rem", opacity: "0.85" }}>
              x{quantity}
            </span>
          )}
        </div>
        <div style={{ fontSize: "1rem", opacity: "0.85" }}>
          {formatCurrency(item.prices["1"])}
        </div>
      </div>
      <div> {formatCurrency(item.prices["1"] * quantity)}</div>
      <Button
        variant="danger"
        size="sm"
        style={{ marginLeft: "0.1em" }}
        onClick={() => removeFromCart(item.id)}
      >
        &times;
      </Button>
    </Stack>
  );
}
