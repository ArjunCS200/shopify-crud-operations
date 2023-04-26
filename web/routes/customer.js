import { Router } from "express";

import { getallcustomerData, createCustomer } from "../controllers/customer.js";

const customerRoute = Router();

customerRoute.get("/getallcustomerdata", getallcustomerData);

customerRoute.post('/create', createCustomer)

export default customerRoute;
