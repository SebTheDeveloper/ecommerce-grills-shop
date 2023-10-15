import { Form } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";

type AddOnProps = {
  id: number;
  addOn: string;
};

export function AddOn({ id, addOn }: AddOnProps) {
  const { updateAddOns, getSelectedAddOns } = useShoppingCart();

  let addOnFormatted: string;
  switch (addOn) {
    case "Open Face":
      addOnFormatted = "open-face";
      break;
    case "Diamond Dust":
      addOnFormatted = "diamond-dust";
      break;
    case "Chipped Tooth":
      addOnFormatted = "chipped-tooth";
      break;
    case "Missing Tooth":
      addOnFormatted = "missing-tooth";
      break;
    default:
      addOnFormatted = "";
      break;
  }

  const selectedAddOns = getSelectedAddOns(id);
  let isSelected = selectedAddOns?.find(
    (item) => item.name === addOnFormatted
  )?.isAdded;

  if (isSelected === undefined) {
    isSelected = false;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "start",
        justifyContent: "space-between",
        width: "100%",
        padding: "0em 1.2em",
        animation: "grow-in 0.8s ease-in-out",
      }}
    >
      <Form.Check
        inline
        type="checkbox"
        checked={isSelected}
        id={`inline-checkbox-1`}
        style={{
          opacity: isSelected ? "1" : "0.85",
        }}
        onChange={() => updateAddOns(id, addOnFormatted)}
      ></Form.Check>
      <p
        style={{
          opacity: isSelected ? "0.9" : "0.75",
          fontWeight: "300",
          flexBasis: "100%",
        }}
      >
        {addOn}
      </p>
      <p
        style={{
          marginLeft: "1em",
          fontSize: "1.2em",
          color: "rgb(25, 135, 84)",
          opacity: isSelected ? "0.9" : "0.55",
        }}
      >
        {addOnFormatted === "missing-tooth" ? "+$50" : "+$30"}
      </p>
    </div>
  );
}
