import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import cors from "cors";
import dotenv from "dotenv";
import https from "https";

import commerceTools from "./CommerceToolsHelper.js";
import superPayment from "./superpayment.js";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "client/build")));
app.use("/confirm", express.static(path.join(__dirname, "client/build")));
app.use(cors());

dotenv.config();

const PORT = process.env.CT_PORT;
const BASE_URL = process.env.CT_BASE_URL;

/* ------ GET PRODUCTS ------ */
app.get("/products", async (req, res) => {
  const currency = req.params.currency;
  const ctProducts = await commerceTools.getProducts();
  res.send(ctProducts.results);
});

/* ------ GET CUSTOMER BY EMAIL ------ */
app.get("/customer/:email?", async (req, res) => {
  const customers = await commerceTools.getCustomerByEmail(req.params.email);
  if (req.params.email === undefined || customers.total === 0)
    res.send({
      id: "",
      name: "",
      address: "",
      city: "",
      country: "",
    });
  else {
    res.send({
      id: customers.results[0].id,
      name: `${customers.results[0].firstName} ${customers.results[0].lastName}`,
      addressId: customers.results[0].addresses[0].id,
      address: `${customers.results[0].addresses[0].streetName}`,
      city: customers.results[0].addresses[0].city,
      country: customers.results[0].addresses[0].country,
    });
  }
});

/* ------ GET CART------ */
app.get("/cart/:cartId?", async (req, res) => {
  res.send(await commerceTools.getCart(req.params.cartId));
});

/* ------ CREATE CART ------ */
app.post("/cart", async (req, res) => {
  res.send(await commerceTools.createCart());
});

/* ------ ADD CART LINE ITEM ------ */
app.post("/cart/line-item", async (req, res) => {
  const cartId = req.body.cartId;
  const productId = req.body.productId;
  const variantId = req.body.variantId;
  const version = req.body.version;
  res.send(
    await commerceTools.cartAddLineItem(cartId, productId, variantId, version)
  );
});

/* ------ ADD CUSTOMER TO CART------ */
app.post("/cart/customer", async (req, res) => {
  const cartId = req.body.cartId;
  const customerId = req.body.customerId;
  res.send(await commerceTools.cartAddCustomer(cartId, customerId));
});

/* ------ CREATE CUSTOMER ------ */
app.post("/customer", async (req, res) => {
  const payload = {
    email: req.body.email,
    name: req.body.name,
    address: {
      line1: req.body.address,
      city: req.body.city,
      country: req.body.country,
    },
  };
  payload.cartId = req.body.cartId;
  res.send(await commerceTools.createCustomer(payload));
});

/* ------ CREATE CUSTOMER ------ */
app.post("/customer", async (req, res) => {
  const payload = {
    email: req.body.email,
    name: req.body.name,
    address: {
      line1: req.body.address,
      city: req.body.city,
      country: req.body.country,
    },
  };
  payload.cartId = req.body.cartId;
  res.send(await commerceTools.createCustomer(payload));
});

/* ------ CREATE ORDER ------ */
app.post("/order", async (req, res) => {
  res.send(await commerceTools.createOrder(req.body.cartId));
});

/* ------ CREATE PAYMENT ------ */
app.post("/create-super-payment", async (req, res) => {
  let CURRENCY_SIGN = process.env.CURRENCY_SIGN;
  res.send(await commerceTools.createPayment(CURRENCY_SIGN, req.body.amount));
});

/* ------ ADD PAYMENT TO ORDER ------ */
app.post("/add-payment-to-order", async (req, res) => {
  let orderId = req.body.orderId;
  let paymentId = req.body.paymentId;
  res.send(await commerceTools.addPaymentToOrder(orderId, paymentId));
});

/* ------ UPDATE ORDER ------ */
app.post("/update-order-status", async (req, res) => {
  let orderId = req.body.orderId;
  let paymentStatus = req.body.paymentStatus;
  res.send(await commerceTools.updateOrder(orderId, paymentStatus));
});

/* ------ CREATE SUPER PAYMENT OFFER ------ */
app.post("/super-payment/get-offer", async (req, res) => {
  let post_data = {
    minorUnitAmount: 10000,
    couponDiscount: 1000,
    cart: {
      id: "cart101",
      items: [
        {
          name: "Im a product",
          quantity: 2,
          minorUnitAmount: 10000,
          url: "https://www.dev-site-2x6137.wixdev-sites.org/product-page/i-m-a-product-8",
        },
      ],
    },
    page: "Checkout",
    output: "both",
    test: true,
  };
  if (req.body) post_data = { ...post_data, ...req.body };
  if (post_data.couponDiscount) {
    post_data.minorUnitAmount -= post_data.couponDiscount;
    delete post_data.couponDiscount;
  }
  let results = await superPayment.getOffer(post_data);
  res.send(results);
});

/* ------ CREATE SUPER PAYMENT LINK ------ */
app.post("/super-payment/get-offer-link", async (req, res) => {
  const SUPER_successUrl = process.env.SUPER_successUrl;
  const SUPER_cancelUrl = process.env.SUPER_cancelUrl;
  const SUPER_failureUrl = process.env.SUPER_failureUrl;

  let post_data = {
    cashbackOfferId: "1fed4780-233f-4bc4-8a00-e40d95caa3c6",
    successUrl: SUPER_successUrl,
    cancelUrl: SUPER_cancelUrl,
    failureUrl: SUPER_failureUrl,
    minorUnitAmount: 10000,
    currency: "GBP",
    externalReference: "order_id_123450",
  };

  if (req.body) post_data = { ...post_data, ...req.body };

  let results = await superPayment.getPaymentLink(post_data);
  res.send(results);
});

/* ------ REFUND SUPER PAYMENT ------ */
app.post("/super-payment/refunds", async (req, res) => {
  let post_data = {
    transactionId: "ad9f5bcf-3df8-4967-b50c-898f4053ccc7",
    minorUnitAmount: 11637,
    currency: "GBP",
    externalReference: "refund102",
    test: true,
  };

  if (req.body) post_data = { ...post_data, ...req.body };

  let results = await superPayment.refundPayment(post_data);
  res.send(results);
});

app.listen(PORT, () => {
  console.log(`Server Started on on port: ${PORT}`);
});
