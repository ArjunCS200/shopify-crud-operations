import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
  id: String,
  name: String,
  email: String,
  createdAt: String,
  updatedAt: String,
  totalWeight: String,
  discountCode: String,
  shippingAddress: Object,
  originalTotalPriceSet: Object,
  total_discount: String,
});
export const Order = mongoose.model("order", OrderSchema);
