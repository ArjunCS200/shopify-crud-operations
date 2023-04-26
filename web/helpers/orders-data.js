import shopify from "../shopify.js";
import { Order } from "../models/order.js";
import { logger } from "./logger.js";

export default async function getallorders(session) {
  try {
    let hasNextPage = true;
    let afterCursor = null;
    let orders = [];
    while (hasNextPage) {
      const client = new shopify.api.clients.Graphql({ session });
      const response = await client.query({
        data: `{
                orders(first: 150, after: ${afterCursor}) {
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    }
                edges {
                    cursor
                    node {
                        id
                        name
                        email
                        createdAt
                        updatedAt
                        totalWeight
                        discountCode
                        originalTotalPriceSet {
                          presentmentMoney {
                            amount,
                            currencyCode,
                          }
                        }
                        shippingAddress {
                            firstName
                            lastName
                            company
                            address1
                            address2
                            city
                            province
                            country
                            zip
                            phone
                        }
                    }
                }
                }
            }`,
      });
      logger.info(await response);
      const data = await response;
      orders = [...orders, ...data.body.data.orders.edges];
      hasNextPage = data.body.data.orders.pageInfo.hasNextPage;
      afterCursor = `"${
        data.body.data.orders.edges[data.body.data.orders.edges.length - 1]
          .cursor
      }"`;
    }

    // for storing all existing customer data into database
    await storeOrders(orders);

    return orders;
  } catch (error) {
    return error;
  }
}

/**
 * function to store all existing customer data into database
 *
 * @param {*} allCustomerData
 */
const storeOrders = async (allOrderData) => {
  allOrderData.map((eachOrderData) => {
    let id = eachOrderData.node.id;
    Order.findOne({ id: id }).then((res) => {
      if (!res) {
        let orderId = "";
        let name = "";
        let email = "";
        let createdAt = "";
        let updatedAt = "";
        let totalWeight = "";
        let discountCode = "";
        let shippingAddress = {};
        let presentmentMoney = {};

        // getting all the required data of products
        orderId = eachOrderData.node.id;
        name = eachOrderData.node.name;
        email = eachOrderData.node.email;
        createdAt = eachOrderData.node.created_at;
        updatedAt = eachOrderData.node.updated_at;
        totalWeight = eachOrderData.node.totalWeight;
        discountCode = eachOrderData.node.discount_code;
        shippingAddress = eachOrderData.node.shippingAddress;
        presentmentMoney = eachOrderData.node.originalTotalPriceSet.presentmentMoney;

        const order = new Order({
          id: orderId,
          name: name,
          email: email,
          createdAt: createdAt,
          updatedAt: updatedAt,
          totalWeight: totalWeight,
          discountCode: discountCode,
          shippingAddress: shippingAddress,
          originalTotalPriceSet: {
            presentmentMoney: presentmentMoney,
          },
        });

        order.save(order).then(() => {
          console.log("order created");
        });
      } else {
        console.log("order already exists");
      }
    });
  });
};
