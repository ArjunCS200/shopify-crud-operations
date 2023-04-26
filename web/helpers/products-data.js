import shopify from "../shopify.js";
import { Product } from "../models/product.js";

export default async function getallproducts(session) {
  try {
    let hasNextPage = true;
    let afterCursor = null;
    let products = [];
    while (hasNextPage) {
      const client = new shopify.api.clients.Graphql({ session });
      const response = await client.query({
        data: `{
                products(first: 50, after: ${afterCursor}) {
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    }
                edges {
                    cursor
                    node {
                    id
                    title
                    handle
                    createdAt
                    description
                    productType
                    publicationCount
                    publishedAt
                    storefrontId
                    tags
                    title
                    totalInventory
                    totalVariants
                    tracksInventory
                    }
                }
                }
            }`,
      });
      const data = await response;
      products = [...products, ...data.body.data.products.edges];
      hasNextPage = data.body.data.products.pageInfo.hasNextPage;
      afterCursor = `"${
        data.body.data.products.edges[data.body.data.products.edges.length - 1]
          .cursor
      }"`;
    }

    // for storing all existing customer data into database
    await storeProduct(products);

    return products;
  } catch (error) {
    return error;
  }
}

/**
 * function to store all existing customer data into database
 *
 * @param {*} allCustomerData
 */
const storeProduct = async (allProductData) => {
  allProductData.map((eachProductData) => {
    let id = eachProductData.node.id;
    Product.findOne({ id: id }).then((res) => {
      if (!res) {
        let productId = "";
        let title = "";
        let handle = "";
        let createdAt = "";
        let description = "";
        let productType = "";
        let publicationCount = "";
        let publishedAt = "";
        let storeFrontId = "";
        let tags = "";
        let totalInventory = "";
        let totalVariants = "";
        let tracksInventory = "";

        // getting all the required data of products
        productId = eachProductData.node.id;
        title = eachProductData.node.title;
        handle = eachProductData.node.handle;
        createdAt = eachProductData.node.createdAt;
        description = eachProductData.node.description;
        productType = eachProductData.node.productType;
        publicationCount = eachProductData.node.publicationCount;
        publishedAt = eachProductData.node.publishedAt;
        storeFrontId = eachProductData.node.storefrontId;
        tags = eachProductData.node.tags;
        totalInventory = eachProductData.node.totalInventory;
        totalVariants = eachProductData.node.totalVariants;
        tracksInventory = JSON.stringify(eachProductData.node.tracksInventory);

        const product = new Product({
          id: productId,
          title: title,
          handle: handle,
          createdAt: createdAt,
          description: description,
          productType: productType,
          publicationCount: publicationCount,
          publishedAt: publishedAt,
          storefrontId: storeFrontId,
          tags: tags,
          totalInventory: totalInventory,
          totalVariants: totalVariants,
          tracksInventory: tracksInventory,
        });

        product.save(product).then(() => {
          console.log("product created");
        });
      } else {
        console.log("product already exists");
      }
    });
  });
};
