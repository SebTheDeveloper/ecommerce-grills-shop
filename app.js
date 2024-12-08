import express from "express";
import path from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import storeItems from "./backendData.json" assert { type: "json" };

config();

const app = express();
const port = process.env.PORT || 3000;

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);

const absoluteDistPath = path.resolve(currentDirectory, "dist");
const absoluteIndexPath = path.join(absoluteDistPath, "index.html");

app.use(express.json());
app.use(express.static(absoluteDistPath));

app.get("*", (req, res) => {
  res.sendFile(absoluteIndexPath);
});

const stripe = new Stripe(process.env.STRIPE_API_KEY);

app.post("/create-checkout-session", async (req, res) => {
  try {
    const lineItems = [];

    // Shipping cost
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Shipping",
          description: "Shipping Cost",
        },
        unit_amount: 810,
      },
      quantity: 1,
    });

    req.body.items.forEach((item) => {
      const storeItem = storeItems.find(
        (storeItem) => storeItem.id === Number(String(item.id)[0])
      );

      let isMoldKit = false;
      let moldKitSelection = "";
      if (storeItem.name === "Mold Kit") {
        isMoldKit = true;

        if (item.quantity === 1) {
          moldKitSelection = "top only";
        } else if (item.quantity === 2) {
          moldKitSelection = "bottom only";
        } else if (item.quantity === 3) {
          moldKitSelection = "top & bottom";
        }
      }

      let veryGoodPrice = 0;

      switch (item.quantity) {
        case 1:
          veryGoodPrice = Number(storeItem?.prices["1"]);
          break;
        case 4:
          veryGoodPrice = Number(storeItem?.prices["4"]);
          break;
        case 6:
          veryGoodPrice = Number(storeItem?.prices["6"]);
          break;
        case 8:
          veryGoodPrice = Number(storeItem?.prices["8"]);
          break;
        case 10:
          veryGoodPrice = Number(storeItem?.prices["10"]);
          break;
      }

      // Main items
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: isMoldKit
              ? `Mold Kit | ${moldKitSelection}`
              : `${storeItem.name} (${item.quantity} ${
                  item.quantity > 1 ? "teeth" : "tooth"
                })`,
          },
          unit_amount: isMoldKit
            ? storeItem.prices[item.quantity || 1] * 100
            : veryGoodPrice * 100,
        },
        quantity: 1,
      });

      // Add-ons
      if (item.addOns && item.addOns.length) {
        item.addOns.forEach((addOn) => {
          if (addOn.isAdded) {
            lineItems.push({
              price_data: {
                currency: "usd",
                product_data: {
                  name: `${storeItem.name} *add-on* | ${addOn.name}`,
                },
                unit_amount: addOn.price * 100,
              },
              quantity: 1,
            });
          }
        });
      }
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.SERVER_URL}/success`,
      cancel_url: `${process.env.SERVER_URL}`,
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
