import { Page, DataTable } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";
import { useEffect, useState } from "react";

export default function AllOrders() {
  const fetch = useAuthenticatedFetch();

  /**
   * declaring usestate variable for storing all the product data
   *
   */

  const [orderData, setOrderData] = useState([]);

  /**
   * function to arrange all the user data into an array of arrays => [[...],[...]]
   *
   * @param {*} data
   * @returns
   */

  const arrangeData = async (allOrderData) => {
    let arrangedOrderData = [];

    // mapping through each of the array object
    allOrderData.map((eachOrderData) => {
      let orderId = "";
        let name = "";
        let email = "";
        let createdAt = "";
        let updatedAt = "";
        let totalWeight = "";
        let discountCode = "";
        let shippingAddress = "";
        let totalAmount = "";

        // getting all the required data of products
        orderId = eachOrderData.node.id;
        name = eachOrderData.node.name;
        email = eachOrderData.node.email;
        createdAt = eachOrderData.node.created_at;
        updatedAt = eachOrderData.node.updated_at;
        totalWeight = eachOrderData.node.totalWeight;
        discountCode = eachOrderData.node.discount_code;
        shippingAddress = eachOrderData.node.shippingAddress ? eachOrderData.node.shippingAddress.address1 : "";
        totalAmount = eachOrderData.node.originalTotalPriceSet.presentmentMoney.amount;


      // pushing above formatted data into arrangedUserData array
      arrangedOrderData.push([
        orderId,
        name,
        email,
        createdAt,
        updatedAt,
        totalWeight,
        discountCode,
        shippingAddress,
        totalAmount,
      ]);
    });

    return arrangedOrderData;
  };

  /**
   * useEffect hook which will load only one time when the page is rendered
   *
   */
  useEffect(() => {
    (async () => {
      // calling api to get all the customer data
      const allOrderDataResult = await fetch("/api/orders/getallorders");
      let allOrderData = await allOrderDataResult.json();
      let arrangedOrderData = await arrangeData(allOrderData.data.userData);
      // setting processed data into useState variable userData
      setOrderData(arrangedOrderData);
    })();
  }, []);

  return (
    <Page>
      <TitleBar title="All Orders" />
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
        ]}
        headings={[
          "order Id",
          "name",
          "email",
          "createdAt",
          "updatedAt",
          "totalWeight",
          "discountCode",
          "shippingAddress",
          "totalAmount",
        ]}
        rows={orderData}
      />
    </Page>
  );
}
