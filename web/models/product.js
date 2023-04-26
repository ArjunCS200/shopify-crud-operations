import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
  id: String,
  title: String,
  handle: String,
  createdAt: String,
  description: String,
  productType: String,
  publicationCount: String,
  publishedAt: String,
  storefrontId: String,
  tags: Array,
  totalInventory: String,
  totalVariants: String,
  tracksInventory: String,
});
export const Product = mongoose.model("product", ProductSchema);
