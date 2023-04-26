import { logger } from "../helpers/logger.js";
import getallorders from "../helpers/orders-data.js";

export const getAllOrdersData = async (req, res) => {
  try {
    const orderData = await getallorders(res.locals.shopify.session);
    return res.status(200).json({
      status: "true",
      data: {
        userData: orderData,
      },
      message: "successfully fetched all the order data",
    });
  } catch (error) {
    return res.status(500).json({
      status: "false",
      data: {
        Error: error.message,
      },
      message: "Some Error Occured while fetching all order data",
    });
  }
};
