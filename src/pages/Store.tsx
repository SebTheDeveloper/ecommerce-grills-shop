import { Row, Col } from "react-bootstrap";
import storeItems from "../data/items.json";
import { StoreItem, StoreItemProps } from "../components/StoreItem";
import { LogoTitle } from "../components/LogoTitle";

export function Store() {
  return (
    <>
      <LogoTitle />
      <h1 style={{ marginBottom: "1.25rem", opacity: "0.97" }} id="shop">
        Shop
      </h1>
      <Row xs={1} md={2} lg={3} className="g-5 g-md-4 align-items-start">
        {storeItems.map((item) => (
          <Col key={item.id}>
            <StoreItem {...(item as unknown as StoreItemProps)} />
          </Col>
        ))}
      </Row>
    </>
  );
}
