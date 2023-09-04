// import { useState } from "react";

import { Row, Col } from "react-bootstrap";
import storeItems from "../data/items.json";
import { StoreItem } from "../components/StoreItem";

export function Store() {
  return (
    <>
      <div className="title-wrapper">
        <div className="title">Palm Beach Custom Grillz</div>
        <span style={{ marginLeft: "auto" }}>
          grillz done right the first time.
        </span>
      </div>
      <h1 style={{ marginBottom: "1.25rem", opacity: "0.97" }} id="shop">
        Shop
      </h1>
      <Row xs={1} md={2} lg={3} className="g-5 g-md-4">
        {storeItems.map((item) => (
          <Col key={item.id}>
            <StoreItem {...item} />
          </Col>
        ))}
      </Row>
    </>
  );
}
