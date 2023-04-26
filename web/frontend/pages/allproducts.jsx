import { Page, DataTable } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";
import { useEffect, useState } from "react";

export default function AllProducts() {
  const fetch = useAuthenticatedFetch();

  /**
   * declaring usestate variable for storing all the product data
   *
   */

  const [productData, setProductData] = useState([]);

  /**
   * function to arrange all the user data into an array of arrays => [[...],[...]]
   *
   * @param {*} data
   * @returns
   */

  const arrangeData = async (allProductData) => {
    let arrangedProductData = [];

    // mapping through each of the array object
    allProductData.map((eachProductData) => {
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

      // pushing above formatted data into arrangedUserData array
      arrangedProductData.push([
        productId,
        title,
        handle,
        createdAt,
        description,
        productType ? productType : "N/A",
        publicationCount,
        publishedAt,
        storeFrontId,
        tags,
        totalInventory,
        totalVariants,
        tracksInventory,
      ]);
    });

    return arrangedProductData;
  };

  /**
   * useEffect hook which will load only one time when the page is rendered
   *
   */
  useEffect(() => {
    (async () => {
      // calling api to get all the customer data
      const allProductDataResult = await fetch("/api/products/getallproducts");
      let allProductData = await allProductDataResult.json();
      let arrangedProductData = await arrangeData(allProductData.data.userData);
      // setting processed data into useState variable userData
      setProductData(arrangedProductData);
    })();
  }, []);

  return (
    <Page>
      <TitleBar title="All Products" />
      <DataTable
        columnContentTypes={[
          "text",
          "text",
          "text",
          "text",
          "text",
          "text",
          "text",
          "text",
          "text",
          "text",
          "text",
          "text",
          "text",
        ]}
        headings={[
          "Id",
          "Title",
          "Handle",
          "Created At",
          "Description",
          "Product Type",
          "Publication Count",
          "Published At",
          "StoreFront Id",
          "Tags",
          "Total Inventory",
          "Total Variants",
          "Tracks Inventory",
        ]}
        rows={productData}
      />
    </Page>
  );
}
