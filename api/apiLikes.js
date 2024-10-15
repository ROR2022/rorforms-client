import axios from "axios";

import { hostURL } from "../dataEnv/dataEnv";

export const getLikesForTemplate = async (templateId) => {
  try {
    const response = await axios.get(
      `${hostURL}/api/like/template/${templateId}`
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getLikesForTemplate:..", error);

    return error.response;
  }
};

export const getCommentsForTemplate = async (templateId) => {
  try {
    const response = await axios.get(
      `${hostURL}/api/comment/template/${templateId}`
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getCommentsForTemplate:..", error);

    return error.response;
  }
};

export const postLike = async (like, token) => {
  try {
    const response = await axios.post(`${hostURL}/api/like`, like, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error postLike:..", error);

    return error.response;
  }
};

export const postComment = async (comment, token) => {
  try {
    const response = await axios.post(`${hostURL}/api/comment`, comment, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error postComment:..", error);

    return error.response;
  }
};

export const deleteLike = async (likeId, token) => {
  try {
    const response = await axios.delete(`${hostURL}/api/like/${likeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error deleteLike:..", error);

    return error.response;
  }
};

export const deleteComment = async (commentId, token) => {
  try {
    const response = await axios.delete(`${hostURL}/api/comment/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error deleteComment:..", error);

    return error.response;
  }
};

export const updateLike = async (id, like, token) => {
  try {
    console.log("init updatelike:..", like);
    const response = await axios.patch(`${hostURL}/api/like/${id}`, like, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error updateLike:..", error);

    return error.response;
  }
};

export const updateComment = async (comment, token) => {
  try {
    const response = await axios.patch(
      `${hostURL}/api/comment/${comment._id}`,
      comment,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error updateComment:..", error);

    return error.response;
  }
};
