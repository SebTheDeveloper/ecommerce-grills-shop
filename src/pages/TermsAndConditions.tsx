import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";

export function TermsAndConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { termsAccepted, setTermsAccepted, cartItems, openCart } =
    useShoppingCart();

  return (
    <div className="text-content fade-in">
      <div
        style={{
          textAlign: "center",
          marginTop: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontFamily: "Lobster",
          }}
        >
          Terms and Conditions:
        </h1>
        <a
          href="#accept"
          style={{
            textDecoration: "none",
            fontSize: "1rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Skip to Accept
        </a>
      </div>
      <p>
        <strong>In-Person Procedures:</strong> Please note that we do not
        perform dental procedures and are unable to create in-person teeth
        impressions. To proceed, you must either purchase our do-it-yourself
        mold kit or have a licensed dentist (in accordance with Florida law)
        create an impression for you.
      </p>

      <p>
        <strong>Order Acceptance Policy:</strong> Please be aware that receiving
        an electronic or other type of order confirmation does not indicate our
        acceptance of your order, nor does it confirm our offer to sell. We
        retain the right to accept or decline your order for any reason, even
        after its receipt. Additionally, we reserve the right, without prior
        notice, to provide fewer items than the quantity you ordered for any
        given item. In certain cases, we might need additional verification or
        information before we can accept your order.
      </p>

      <p>
        <strong>Turnaround Time:</strong> 2-3 weeks for all custom grillz
        orders.
      </p>

      <p>
        <strong>Valuables and Responsibility:</strong> We will not be held
        accountable for any loss or damage resulting from sending personal
        valuables to us.
      </p>

      <p>
        <strong>Refund Policy:</strong> If your custom grillz order is less than
        45 days old and hasn't been made or started yet, you can request a 100%
        refund. However, no refunds will be issued for orders that have been
        started, completed or if we haven't received a suitable mold within 45
        days of the transaction. The responsibility for a proper mold lies with
        you; an ill-fitting grillz may result from an inaccurate mold. In the
        event of dissatisfaction due to a bad mold, we can create a new one for
        half the cost, with you sending back the gold grill. Shipping and
        insurance are not included in this offer.
      </p>

      <p>
        <strong>Disclaimer & Limitation of Liability:</strong> By using our
        site, you agree that the only and utmost liability of
        PalmBeachCustomGrillz.com arising from any product sold shall be limited
        to the price of the ordered product. Under no circumstances shall
        PalmBeachCustomGrillz.com, its owner, officers, employees, or
        representatives be held liable for special, indirect, consequential, or
        punitive damages associated with the sale of any product or products.
      </p>

      <p>
        <strong>Indemnification:</strong> By using our services, you agree to
        defend, indemnify, and hold PalmBeachCustomGrillz.com harmless from any
        claims, damages, costs, and expenses, including legal fees, related to
        your use of our platform.
      </p>

      <p>
        <strong>Limitation of Liability:</strong> PalmBeachCustomGrillz.com
        shall not be liable for any direct, indirect, special, punitive,
        incidental, or consequential damages, even if previously advised,
        arising from the use of information, services, products, and materials
        on our website. These limitations apply despite any failure of essential
        purpose of any limited remedy. Jurisdictional laws might affect the
        applicability of these limitations.
      </p>
      {!termsAccepted ? (
        <Button
          id="accept"
          style={{ marginTop: "2rem", padding: "0.5em 0", fontSize: "1.2rem" }}
          onClick={() => setTermsAccepted(true)}
        >
          I Accept the Terms and Conditions
        </Button>
      ) : (
        <>
          <Button
            id="accept"
            variant="success"
            style={{
              marginTop: "2rem",
              padding: "0.5em 0",
              fontSize: "1.2rem",
            }}
          >
            Terms Accepted &#x2714;
          </Button>
          {cartItems.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p onClick={() => openCart()} className="go-to-cart">
                Go to Cart
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
