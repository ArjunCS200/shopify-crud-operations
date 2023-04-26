import getallcustomer from "../helpers/customers-data.js";
import createCustomerInShopify from "../helpers/create-customer.js";

export const getallcustomerData = async (req, res) => {
  try {
    const customerData = await getallcustomer(res.locals.shopify.session);
    return res.status(200).json({
      status: "true",
      data: {
        userData: customerData,
      },
      message: "all the user data",
    });
  } catch (e) {
    return res.status(500).json({
      status: "false",
      data: {
        userData: e.message,
      },
      message: "error in fetching user data",
    });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const customerCreationStatus = await createCustomerInShopify(
      res.locals.shopify.session,
      req.body
    );
    if (customerCreationStatus.body.data.customerCreate.userErrors.length) {
      return res.status(500).json({
        status: "false",
        data: {
          creationstatus: false,
          errors: customerCreationStatus.body.data.customerCreate.userErrors,
        },
        message: "some error in creating customer",
      });
    }
    return res.status(200).json({
      status: "true",
      data: {
        creationstatus: customerCreationStatus,
      },
      message: "customer created",
    });
  } catch (error) {
    return res.status(500).json({
      status: "false",
      data: {
        error: error,
      },
      message: "error in creating customer",
    });
  }
};
