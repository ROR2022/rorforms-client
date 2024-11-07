"use client";
// eslint-disable-next-line import/order
import React from "react";
//import jsforce from "jsforce";

import { Button } from "@nextui-org/button";

//import { SF_CLIENT_ID, SF_CALLBACK_URL } from "@/dataEnv/dataEnv";
import { createSalesforceAccountAndContact } from "@/api/apiSalesforce";

const page = () => {
  /* const basicURL = "https://login.salesforce.com/services/oauth2/authorize?";
  const response_type = "response_type=token";
  const client_id = "&client_id=" + SF_CLIENT_ID;
  const redirect_uri = "&redirect_uri=" + SF_CALLBACK_URL;
  const completeUrl = basicURL + response_type + client_id + redirect_uri; */
  const handleSalesforceIntegration = async () => {
    try {
      const response = await fetch("/api/salesforce-auth", {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        console.log("Token de Salesforce obtenido:", data.access_token);

        return data.access_token;
      } else {
        console.error("Error al obtener el token de Salesforce:", data.error);
      }
    } catch (error) {
      console.error("Error en la integración:", error);
    }
  };
  const handleClick = async () => {
    try {
      const userData = {
        firstName: "Test",
        lastName: "User",
        companyName: "Test Company",
      };
      const accesToken = await handleSalesforceIntegration();

      console.log("Token de Salesforce obtenido:", accesToken);
      //const response = await createSalesforceAccountAndContact(userData);
      //console.log("Response from Salesforce:", response);
    } catch (error) {
      console.error("Error in creating Salesforce Account and Contact", error);
    }
    //console.log("SalesForce page:", completeUrl);
  };

  return (
    <div>
      <Button onClick={handleClick}>Create SalesForce Account</Button>
    </div>
  );
};

export default page;
