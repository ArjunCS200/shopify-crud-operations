import {
  Page,
  DataTable,
  Form,
  FormLayout,
  Checkbox,
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

  const [lastname, setLastName] = useState("");
  const [firstname, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const toastMarkup = active ? (
    <Toast content="Customer Created" onDismiss={toggleActive} />
  ) : null;

  const firstnameHandler = useCallback(
    (newValue) => setFirstName(newValue),
    []
  );
  const lastnameHandler = useCallback((newValue) => setLastName(newValue), []);
  const emailHandler = useCallback((newValue) => setEmail(newValue), []);
  const phoneHandler = useCallback((newValue) => setPhone(newValue), []);
  const addressHandler = useCallback((newValue) => setAddress(newValue), []);
  const cityHandler = useCallback((newValue) => setCity(newValue), []);
  const provinceHandler = useCallback((newValue) => setProvince(newValue), []);
  const zipHandler = useCallback((newValue) => setZip(newValue), []);
  const countryHandler = useCallback((newValue) => setCountry(newValue), []);

  const submitData = async () => {
    const formData = {
      firstname,
      lastname,
      email,
      phone,
      address,
      city,
      province,
      zip,
      country,
    };

    console.log(formData);

    const CUSTOMER_CREATION_URL = "/api/customer/create";
    const customerCreation = await fetch(CUSTOMER_CREATION_URL, {
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
    let response = await customerCreation.json();
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
              name="firstname"
              label="First Name"
              value={firstname}
              placeholder="Enter first name"
              onChange={firstnameHandler}
            />
            <TextField
              type="text"
              name="lastname"
              label="Last Name"
              value={lastname}
              placeholder="Enter last name"
              onChange={lastnameHandler}
            />
            <TextField
              type="text"
              name="email"
              label="Email"
              value={email}
              placeholder="Enter email"
              onChange={emailHandler}
            />
            <TextField
              type="text"
              name="phone"
              label="Phone Number"
              value={phone}
              placeholder="Enter phone Number"
              onChange={phoneHandler}
            />
            <TextField
              type="text"
              name="address"
              label="Address"
              value={address}
              placeholder="Enter Address"
              onChange={addressHandler}
            />
            <TextField
              type="text"
              name="city"
              label="City"
              value={city}
              placeholder="Enter City"
              onChange={cityHandler}
            />
            <TextField
              type="text"
              name="province"
              label="Province"
              value={province}
              placeholder="Enter Province"
              onChange={provinceHandler}
            />
            <TextField
              type="text"
              name="zip"
              label="ZIP"
              value={zip}
              placeholder="Enter zip code"
              onChange={zipHandler}
            />
            <TextField
              type="text"
              name="country"
              label="Country"
              value={country}
              placeholder="Enter country name"
              onChange={countryHandler}
            />
            <Button submit>Submit</Button>
          </FormLayout>
        </Form>
      </Frame>
    </Page>
  );
}
