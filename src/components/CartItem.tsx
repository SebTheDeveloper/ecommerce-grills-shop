import { Button, Stack } from "react-bootstrap";
import {
  AddOn as AddOnType,
  useShoppingCart,
} from "../context/ShoppingCartContext";
import storeItems from "../data/items.json";
import { formatCurrency } from "../utilities/formatCurrency";
import { useEffect, useState } from "react";

type CartItemProps = {
  id: number;
  quantity: number;
};

export function CartItem({ id, quantity }: CartItemProps) {
  const { removeFromCart, getSelectedAddOns } = useShoppingCart();
  const [addOns, setAddOns] = useState<AddOnType[] | undefined>();
  const [addOnTotal, setAddOnTotal] = useState(0);
  const item = storeItems.find((i) => i.id === Number(String(id)[0]));

  useEffect(() => {
    const selectedAddOns = getSelectedAddOns(id);
    if (selectedAddOns !== undefined && selectedAddOns.length > 0) {
      setAddOns(selectedAddOns);
    }
  }, []);

  useEffect(() => {
    const totals = addOns?.reduce((total, curr) => total + curr.price, 0);
    if (totals != undefined && totals > 0) {
      setAddOnTotal(totals);
    }
  }, [addOns]);

  if (item == null) return <div>Item not found!</div>;

  let isMoldKit = false;
  let moldKitSelection = "";
  if (id === 6) {
    isMoldKit = true;

    if (quantity === 1) {
      moldKitSelection = " - top only";
    } else if (quantity === 2) {
      moldKitSelection = " - bottom only";
    } else if (quantity === 3) {
      moldKitSelection = " - top & bottom";
    }
  }

  let veryGoodPrice = 0;

  switch (quantity) {
    case 1:
      veryGoodPrice = Number(item.prices["1"]);
      break;
    case 4:
      veryGoodPrice = Number(item.prices["4"]);
      break;
    case 6:
      veryGoodPrice = Number(item.prices["6"]);
      break;
    case 8:
      veryGoodPrice = Number(item.prices["8"]);
      break;
    case 10:
      veryGoodPrice = Number(item.prices["10"]);
      break;
  }

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
        <div className="fs-7">
          {String(id).length > 1 && (
            <span
              className="text-primary"
              style={{
                fontSize: "0.7em",
                opacity: "0.7",
              }}
            >
              +
            </span>
          )}
          {item.name}
        </div>
        <div style={{ fontSize: "1rem", opacity: "0.85" }}>
          <span>
            {
              isMoldKit
                ? formatCurrency(
                    (item.prices as unknown as { [key: string]: number })[
                      String(quantity)
                    ]
                  )
                : formatCurrency(veryGoodPrice) /* FIX */
            }
          </span>
          <span
            style={{
              fontSize: !isMoldKit ? "0.95rem" : "0.8rem",
              opacity: "0.85",
              color: "gold",
              marginLeft: "0.25em",
            }}
          >
            {!isMoldKit
              ? `(${quantity} ${quantity > 1 ? "teeth" : "tooth"})`
              : moldKitSelection}
          </span>
          <div>
            {addOns?.map((item, index) => (
              <InCartAddOn addOn={item} key={index} />
            ))}
          </div>
        </div>
      </div>
      <div>
        {" "}
        {
          isMoldKit
            ? formatCurrency(
                (item.prices as unknown as { [key: string]: number })[
                  String(quantity)
                ]
              )
            : formatCurrency(veryGoodPrice + addOnTotal)
        }
      </div>
      <Button
        variant="danger"
        size="sm"
        style={{ marginLeft: "0.1em" }}
        onClick={() => removeFromCart(id)}
      >
        &times;
      </Button>
    </Stack>
  );
}

type InCartAddOnProps = {
  addOn: AddOnType;
};

function InCartAddOn({ addOn }: InCartAddOnProps) {
  return (
    <>
      <div style={{ fontSize: "0.8em", opacity: "0.9" }}>
        <span style={{ marginRight: "0.25em" }}>{`+ $${addOn.price}`}</span>
        <span>{addOn.name}</span>
      </div>
    </>
  );
}
