"use client";
// eslint-disable-next-line import/order
import React from "react";
//import jsforce from "jsforce";

import { Button } from "@nextui-org/button";

import { SF_CLIENT_ID, SF_CALLBACK_URL } from "@/dataEnv/dataEnv";

const page = () => {
  const basicURL = "https://login.salesforce.com/services/oauth2/authorize?";
  const response_type = "response_type=token";
  const client_id = "&client_id=" + SF_CLIENT_ID;
  const redirect_uri = "&redirect_uri=" + SF_CALLBACK_URL;
  const completeUrl = basicURL + response_type + client_id + redirect_uri;
  const handleOAuth = () => {
    window.location.href = completeUrl;
    //console.log("SalesForce page:", completeUrl);
  };

  return (
    <div>
      <Button onClick={handleOAuth}>SalesForce page</Button>
    </div>
  );
};

export default page;
