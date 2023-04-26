import { Router } from "express";

import { getAllOrdersData } from "../controllers/order.js";

const orderRoute = Router();

orderRoute.get("/getallorders", getAllOrdersData);

export default orderRoute;
