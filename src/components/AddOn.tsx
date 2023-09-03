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
  const isSelected = selectedAddOns?.find(
    (item) => item.name === addOnFormatted
  )?.isAdded;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "start",
        justifyContent: "space-between",
        width: "100%",
        padding: "0em 1.2em",
      }}
    >
      <Form.Check
        inline
        type="checkbox"
        checked={isSelected}
        id={`inline-checkbox-1`}
        onChange={() => updateAddOns(id, addOnFormatted)}
      ></Form.Check>
      <p style={{ fontWeight: "300", flexBasis: "100%" }}>{addOn}</p>
      <p
        style={{
          marginLeft: "1em",
          fontSize: "1.2em",
          color: "rgb(25, 135, 84)",
          opacity: "0.75",
        }}
      >
        {addOnFormatted === "missing-tooth" ? "$50" : "$30"}
      </p>
    </div>
  );
}
