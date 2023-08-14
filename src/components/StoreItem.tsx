import { useState, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { formatCurrency } from "../utilities/formatCurrency";

type StoreItemProps = {
  id: number;
  name: string;
  prices: {
    [key: string]: number;
  };
  imgUrl: string;
};

export function StoreItem({ id, name, prices, imgUrl }: StoreItemProps) {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const quantity = 0;

  useEffect(() => {
    console.log(isSelected);
  }, [isSelected]);

  return (
    <Card
      className="h-100"
      style={{
        animation: "fade-in 0.3s ease-in-out",
        border: isSelected ? "1px solid gold" : "1px solid white",
        boxShadow: isSelected ? "0 0 8px gold" : "",
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
          backgroundColor: "rgb(10, 10, 10)",
          color: "rgb(240, 240, 240)",
        }}
      >
        <Card.Title className="d-flex justify-content-between align-items-baseline mb-4">
          <span className="fs-6">{name}</span>
          <span className="fs-6">1 for {formatCurrency(prices["1"])}</span>
          <span className="fs-6">6 for {formatCurrency(prices["6"])}</span>
          <span className="fs-6">8 for {formatCurrency(prices["8"])}</span>
          <span className="fs-6">10 for {formatCurrency(prices["10"])}</span>
        </Card.Title>
        <div className="mt-auto">
          {quantity === 0 ? (
            <Button
              onClick={() => {
                setIsSelected(!isSelected);
              }}
            >
              + Add to Cart
            </Button>
          ) : null}
        </div>
      </Card.Body>
    </Card>
  );
}
