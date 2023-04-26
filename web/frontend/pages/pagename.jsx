import { Page, DataTable } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";
import { useEffect, useState } from "react";

export default function PageName() {
  const fetch = useAuthenticatedFetch();

  /**
   * declaring usestat variable for storing all the user data
   *
   */

  const [userData, setUserData] = useState([]);

  /**
   * function to arrange all the user data into an array of arrays => [[...],[...]]
   *
   * @param {*} data
   * @returns
   */

  const arrangeData = async (allUserData) => {
    let arrangedUserData = [];

    let customerName;
    let customerCreatedAt;
    let customerEmail;
    let customerAddress;
    let customerZip;
    let customerPhone;

    // mapping through each of the array object
    allUserData.map((eachCusomerData) => {
      customerName = "";
      customerCreatedAt = "";
      customerEmail = "";
      customerAddress = "";
      customerZip = "";
      customerPhone = "";

      // combining firstname and lastname to get full name
      customerName =
        eachCusomerData.node.firstName + " " + eachCusomerData.node.lastName;

      // formatting user created date and time
      customerCreatedAt =
        eachCusomerData.node.createdAt.split("Z")[0].split("T")[0] +
        " " +
        eachCusomerData.node.createdAt.split("Z")[0].split("T")[1];

      //Getting customer email
      customerEmail = eachCusomerData.node.email;

      // accessing customer address,zip and phone only if address is not null
      if (eachCusomerData.node.defaultAddress) {
        customerAddress = eachCusomerData.node.defaultAddress.address1;
        customerZip = eachCusomerData.node.defaultAddress.zip;
        customerPhone = eachCusomerData.node.defaultAddress.phone;
      }

      // pushing above formatted data into arrangedUserData array
      arrangedUserData.push([
        customerName,
        customerCreatedAt,
        customerEmail,
        customerAddress ? customerAddress : "N/A",
        customerZip ? customerZip : "N/A",
        customerPhone ? customerPhone : "N/A",
      ]);
    });

    return arrangedUserData;
  };

  /**
   * useEffect hook which will load only one time when the page is rendered
   *
   */
  useEffect(() => {
    (async () => {
      // calling api to get all the customer data
      const allCustomerDataResult = await fetch(
        "/api/customer/getallcustomerdata"
      );
      let allCustomerData = await allCustomerDataResult.json();
      let arrangedUserData = await arrangeData(allCustomerData.data.userData);
      // setting processed data into useState variable userData
      setUserData(arrangedUserData);
    })();
  }, []);

  return (
    <Page>
      <TitleBar title="All Customers" />
      <DataTable
        columnContentTypes={["text", "text", "text", "text", "text", "text"]}
        headings={["Name", "Created At", "Email", "Address", "Zip", "Phone"]}
        rows={userData}
      />
    </Page>
  );
}
