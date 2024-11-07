import axios from "axios";

import { hostURL } from "../dataEnv/dataEnv";

export const createNewIssue = async (data, token) => {
  try {
    const response = await axios.post(`${hostURL}/api/issue`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error createNewIssue:..", error);

    return error.response;
  }
};

export const getAllIssues = async (token, page, limit) => {
  try {
    const response = await axios.get(
      `${hostURL}/api/issue?page=${page},&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getAllIssues:..", error);

    return error.response;
  }
};
