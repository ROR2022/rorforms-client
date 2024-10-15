import axios from "axios";

import { hostURL } from "../dataEnv/dataEnv";

export const registerUser = async (data) => {
  try {
    const response = await axios.post(`${hostURL}/api/auth/register`, data);

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error registerUser:..", error);

    return error.response;
  }
};

export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${hostURL}/api/auth/login`, data);

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error loginUser:..", error);

    return error.response;
  }
};

export const findUserByEmail = async (email) => {
  try {
    const response = await axios.get(
      `${hostURL}/api/user/findByEmail/${email}`
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error findUserByEmail:..", error);

    return error.response;
  }
};

export const findUserById = async (id) => {
  try {
    const response = await axios.get(`${hostURL}/api/user/${id}`);

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error findUserById:..", error);

    return error.response;
  }
};

export const confirmVerificationCode = async (verification, code) => {
  try {
    const response = await axios.post(`${hostURL}/api/verification/confirm`, {
      verification,
      code,
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error confirmVerificationCode:..", error);

    return error.response;
  }
};

export const createVerification = async (email) => {
  try {
    const response = await axios.post(`${hostURL}/api/verification`, {
      email,
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error createVerification:..", error);

    return error.response;
  }
};

export const resendVerification = async (verificationId) => {
  try {
    const response = await axios.get(
      `${hostURL}/api/verification/resend/${verificationId}`
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error resendVerification:..", error);

    return error.response;
  }
};

export const updatedPassword = async (dataRecovery) => {
  try {
    const response = await axios.post(
      `${hostURL}/api/auth/recovery`,
      dataRecovery
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error updatedPassword:..", error);

    return error.response;
  }
};

export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${hostURL}/api/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getAllUsers:..", error);

    return error.response;
  }
};

export const uploadImage = async (data, token) => {
  try {
    const response = await axios.post(`${hostURL}/api/user/uploadImage`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error uploadImage:..", error);

    return error.response;
  }
};

export const deleteUser = async (id, token) => {
  try {
    const response = await axios.delete(`${hostURL}/api/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error deleteUser:..", error);

    return error.response;
  }
};

export const assignRolesUser = async (id, roles, token) => {
  try {
    const response = await axios.patch(
      `${hostURL}/api/user/assignRoles/${id}`,
      { roles },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error assignRolesUser:..", error);

    return error.response;
  }
};

export const changeStatusUser = async (id, status, token) => {
  try {
    const response = await axios.patch(
      `${hostURL}/api/user/changeStatus/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error changeStatusUser:..", error);

    return error.response;
  }
};
