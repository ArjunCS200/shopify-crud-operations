import shopify from "../shopify.js";
import { Customer } from "../models/customer.js";

export default async function getallcustomer(session) {
  try {
    let hasNextPage = true;
    let afterCursor = null;
    let customers = [];
    while (hasNextPage) {
      const client = new shopify.api.clients.Graphql({ session });
      const response = await client.query({
        data: `{
             customers(first: 250, after: ${afterCursor}) {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
                 edges {
                  cursor
                 node {
                     id
                     firstName
                     lastName
                     email
                     phone
                     createdAt
                     updatedAt
                     defaultAddress {
                     id
                     firstName
                     lastName
                     company
                     address1
                     address2
                     city
                     province
                     provinceCode
                     country
                     countryCode
                     zip
                     phone
                     name
                     }
                 }
                 }
             }
             }`,
      });
      const data = await response;
      customers = [...customers, ...data.body.data.customers.edges];
      hasNextPage = data.body.data.customers.pageInfo.hasNextPage;
      afterCursor = `"${
        data.body.data.customers.edges[
          data.body.data.customers.edges.length - 1
        ].cursor
      }"`;
    }

    // for storing all existing customer data into database
    await storeCustomer(customers);

    return customers;
  } catch (error) {
    return error;
  }
}

/**
 * function to store all existing customer data into database
 *
 * @param {*} allCustomerData
 */
const storeCustomer = async (allCustomerData) => {
  allCustomerData.map((eachCusomerData) => {
    let email = eachCusomerData.node.email;
    Customer.findOne({ email: email }).then((res) => {
      if (!res) {
        let address = {};
        if (eachCusomerData.node.defaultAddress) {
          address = {
            address: eachCusomerData.node.defaultAddress.address1,
            city: eachCusomerData.node.defaultAddress.city,
            zip: eachCusomerData.node.defaultAddress.zip,
            country: eachCusomerData.node.defaultAddress.country,
            province: eachCusomerData.node.defaultAddress.province,
          };
        }
        const customer = new Customer({
          firstname: eachCusomerData.node.firstname,
          lastname: eachCusomerData.node.lastname,
          email: eachCusomerData.node.email,
          phone: eachCusomerData.node.phone,
          default_address: address,
        });
        customer.save(customer).then(() => {
          console.log("customer created");
        });
      } else {
        console.log("email already exists");
      }
    });
  });
};
