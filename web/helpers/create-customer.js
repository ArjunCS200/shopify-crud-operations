import shopify from "../shopify.js";

export default async function createCustomerInShopify(session, customerData) {
  try {
    const client = new shopify.api.clients.Graphql({ session });
    const data = await client.query({
      data: {
        query: `mutation customerCreate($input: CustomerInput!) {
                    customerCreate(input: $input) {
                        userErrors {
                        field
                        message
                        }
                        customer {
                        id
                        email
                        phone
                        taxExempt
                        acceptsMarketing
                        firstName
                        lastName
                        smsMarketingConsent {
                            marketingState
                            marketingOptInLevel
                        }
                        addresses {
                            address1
                            city
                            country
                            phone
                            zip
                        }
                        }
                    }
                    }`,
        variables: {
          input: {
            email: customerData.email,
            phone: customerData.phone,
            firstName: customerData.firstname,
            lastName: customerData.lastname,
            acceptsMarketing: true,
            addresses: [
              {
                address1: customerData.address,
                city: customerData.city,
                province: customerData.province,
                phone: customerData.phone,
                zip: customerData.zip,
                lastName: customerData.lastname,
                firstName: customerData.firstname,
                country: customerData.country,
              },
            ],
          },
        },
      },
    });
    return data
  } catch (error) {
    return error;
  }
}
