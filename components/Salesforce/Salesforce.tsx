"use client";
import React, { FC, useEffect } from "react";
//import axios from "axios";
import { Button } from "@nextui-org/button";

//import { SF_ENDPOINT } from "@/dataEnv/dataEnv";
import { createAccount } from "@/api/apiSalesforce";

interface SalesforceProps {
  accessToken: string;
}

//{{_endpoint}}/services/data/v{{version}}/sobjects/:SOBJECT_API_NAME

const Salesforce: FC<SalesforceProps> = ({ accessToken }) => {
  useEffect(() => {
    //eslint-disable-next-line
    //console.log("Salesforce FC accessToken: ", accessToken);
  }, [accessToken]);

  const handleCreateAccount = async () => {
    //const url = `${SF_ENDPOINT}/services/data/v62.0/sobjects/Account`;

    try {
      //axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const tempData = {
        Name: "My Account ROR2022",
        Email: "ror2022@mail.com",
        accessToken: accessToken,
      };
      //const response = await axios.post(url, tempData);
      const response = await createAccount(tempData);
      //eslint-disable-next-line
      console.log("Salesforce FC response: ", response);
    } catch (error) {
      //eslint-disable-next-line
      console.error(error);
    }
  };

  return (
    <div>
      <Button onClick={handleCreateAccount}>Create Account</Button>
    </div>
  );
};

export default Salesforce;
