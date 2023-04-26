import { Router } from "express";

import { getAllProductsData, createProduct } from "../controllers/products.js";

const productRoute = Router();

productRoute.get("/getallproducts", getAllProductsData);

productRoute.post('/create', createProduct)

export default productRoute;
