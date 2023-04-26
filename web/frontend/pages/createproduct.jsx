import {
  Page,
  Form,
  FormLayout,
  TextField,
  Button,
  Toast,
  Frame,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";
import { useState, useCallback } from "react";

export default function CreateCustomer() {
  const fetch = useAuthenticatedFetch();

  const [title, setTitle] = useState("");
  const [productType, setProductType] = useState("");
  const [vendor, setVendor] = useState("");

  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const toastMarkup = active ? (
    <Toast content="New Product Added" onDismiss={toggleActive} />
  ) : null;

  const titleHandler = useCallback((newValue) => setTitle(newValue), []);
  const productTypeHandler = useCallback(
    (newValue) => setProductType(newValue),
    []
  );
  const vendorHandler = useCallback((newValue) => setVendor(newValue), []);

  const submitData = async () => {
    const formData = {
      title,
      productType,
      vendor,
    };

    console.log(formData);

    const CUSTOMER_CREATION_URL = "/api/products/create";
    const productCreation = await fetch(CUSTOMER_CREATION_URL, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.APP_ACCESS_TOKEN,
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(formData), // body data type must match "Content-Type" header
    });
    let response = await productCreation.json();
    console.log(response);
    if (response.data.creationstatus) toggleActive();
  };

  return (
    <Page>
      <Frame>
        <TitleBar title="Create Customers" />

        {toastMarkup}

        <Form onSubmit={submitData}>
          <FormLayout>
            <TextField
              type="text"
              name="title"
              label="Product Title"
              value={title}
              placeholder="Enter product title"
              onChange={titleHandler}
            />
            <TextField
              type="text"
              name="type"
              label="Product Type"
              value={productType}
              placeholder="Enter product type"
              onChange={productTypeHandler}
            />
            <TextField
              type="text"
              name="vendor"
              label="Vendor"
              value={vendor}
              placeholder="Enter product vendor"
              onChange={vendorHandler}
            />
            <Button submit>Submit</Button>
          </FormLayout>
        </Form>
      </Frame>
    </Page>
  );
}
