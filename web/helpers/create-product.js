import shopify from "../shopify.js";
import { logger } from "./logger.js";

export default async function createProductInShopify(session, productData) {
  try {
    const client = new shopify.api.clients.Graphql({ session });
    const data = await client.query({
      data: {
        query: `mutation productCreate($input: ProductInput!) {
                    productCreate(input: $input) {
                            userErrors {
                              field
                              message
                            }
                            product {
                              id
                              title
                              productType
                              vendor
                            }
                        }
                      }`,
        variables: {
          input: {
            title: productData.title,
            productType: productData.productType,
            vendor: productData.vendor,
          },
        },
      },
    });
    return data;
  } catch (error) {
    return error;
  }
}
