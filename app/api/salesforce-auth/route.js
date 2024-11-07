import axios from "axios";

import {
  SF_CLIENT_ID,
  SF_CLIENT_SECRET,
  SF_USERNAME,
  SF_PASSWORD,
  SF_TOKEN,
} from "../../../dataEnv/dataEnv";

export async function POST(req) {
  const params = new URLSearchParams();

  params.append("grant_type", "password");
  params.append("client_id", SF_CLIENT_ID);
  params.append("client_secret", SF_CLIENT_SECRET);
  params.append("username", SF_USERNAME);
  params.append("password", SF_PASSWORD + SF_TOKEN);

  try {
    /* const response = await axios.post(
      "https://login.salesforce.com/services/oauth2/token",
      null,
      {
        params: {
          grant_type: "password",
          client_id: SF_CLIENT_ID,
          client_secret: SF_CLIENT_SECRET,
          username: SF_USERNAME,
          password: SF_PASSWORD + SF_TOKEN,
        },
      },
    ); */
    const response = await axios.post(
      "https://login.salesforce.com/services/oauth2/token",
      params,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    console.log("Route response", response);

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.log("Route error", error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: error.response?.status || 500,
    });
  }
}
