import createProductInShopify from "../helpers/create-product.js";
import { logger } from "../helpers/logger.js";
import getallproducts from "../helpers/products-data.js";

export const getAllProductsData = async (req, res) => {
  try {
    const productData = await getallproducts(res.locals.shopify.session);
    return res.status(200).json({
      status: "true",
      data: {
        userData: productData,
      },
      message: "successfully fetched all the product data",
    });
  } catch (error) {
    return res.status(500).json({
      status: "false",
      data: {
        Error: error.message,
      },
      message: "Some Error Occured while fetching all product data",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productCreationStatus = await createProductInShopify(
      res.locals.shopify.session,
      req.body
    );
    logger.info(productCreationStatus);
    if (productCreationStatus.body.data.productCreate.userErrors.length) {
      return res.status(500).json({
        status: "false",
        data: {
          creationstatus: false,
          errors: productCreationStatus.body.data.productCreate.userErrors,
        },
        message: "some error in creating product",
      });
    }
    return res.status(200).json({
      status: "true",
      data: {
        creationstatus: productCreationStatus,
      },
      message: "product created",
    });
  } catch (error) {
    return res.status(500).json({
      status: "false",
      data: {
        error: error,
      },
      message: "error in creating product",
    });
  }
};
