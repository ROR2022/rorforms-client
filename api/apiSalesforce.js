import axios from "axios";

import {
  hostURL,
  SF_INSTANCE_URL,
  SF_LOGIN_URL,
  SF_CLIENT_ID,
  SF_CLIENT_SECRET,
  SF_USERNAME,
  SF_PASSWORD,
  SF_TOKEN,
} from "../dataEnv/dataEnv";

export const createAccount = async (data) => {
  try {
    const response = await axios.post(
      `${hostURL}/api/salesforce/createAccount`,
      data
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error createAccount:..", error);

    return error.response;
  }
};

export const getSalesforceAccessToken = async () => {
  const response = await axios.post(
    `${SF_LOGIN_URL}/services/oauth2/token`,
    null,
    {
      params: {
        grant_type: "password",
        client_id: SF_CLIENT_ID,
        client_secret: SF_CLIENT_SECRET,
        username: SF_USERNAME,
        password: SF_PASSWORD + SF_TOKEN,
      },
    }
  );

  return response.data.access_token;
};

export const createSalesforceAccountAndContact = async (userData, token) => {
  //const token = await getSalesforceAccessToken();
  const accountResponse = await axios.post(
    `${SF_INSTANCE_URL}/services/data/v62.0/sobjects/Account`,
    { Name: userData.companyName },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const contactResponse = await axios.post(
    `${SF_INSTANCE_URL}/services/data/v62.0/sobjects/Contact`,
    {
      FirstName: userData.firstName,
      LastName: userData.lastName,
      AccountId: accountResponse.data.id,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return { account: accountResponse.data, contact: contactResponse.data };
};
