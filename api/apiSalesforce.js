import axios from "axios";

import { hostURL } from "../dataEnv/dataEnv";

export const createAccount = async (data) => {
  try {
    const response = await axios.post(
      `${hostURL}/api/salesforce/createAccount`,
      data,
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error createAccount:..", error);

    return error.response;
  }
};
