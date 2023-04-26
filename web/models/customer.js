import mongoose from "mongoose";

const CustomerSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
  default_address: {
    address : String,
    city: String,
    zip: String,
    country: String,
    province: String,
  },
});
export const Customer = mongoose.model("customer", CustomerSchema);
