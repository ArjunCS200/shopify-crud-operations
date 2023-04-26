// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import customerRoute from "./routes/customer.js";
import productRoute from "./routes/products.js";
import orderRoute from "./routes/order.js";
import dotenv from "dotenv";
import { connectDB } from "./database/connection.js";

import shopify from "./shopify.js";
import webhookHandlers from "./webhooks.js";

dotenv.config();
const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

/**
 * customer routes
 */
app.use("/api/customer", customerRoute);

/**
 * product routes
 */
app.use("/api/products", productRoute);

/**
 * product routes
 */
app.use("/api/orders", orderRoute);

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

connectDB()
  .then(() => {
    app.listen(PORT);
    console.log("PORT Running successfully...");
  })
  .catch(() => {
    console.log("Database Connection Failed");
  });
