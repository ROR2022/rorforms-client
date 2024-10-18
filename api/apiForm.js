import axios from "axios";

import { hostURL } from "../dataEnv/dataEnv";

export const createNewTemplate = async (data, token) => {
  try {
    const response = await axios.post(`${hostURL}/api/template`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error createNewTemplate:..", error);

    return error.response;
  }
};

export const updateTemplate = async (data, token) => {
  try {
    const response = await axios.patch(
      `${hostURL}/api/template/${data._id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error updateTemplate:..", error);

    return error.response;
  }
};

export const getAllTemplates = async () => {
  try {
    const response = await axios.get(`${hostURL}/api/template`);

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getAllTemplates:..", error);

    return error.response;
  }
};

export const getAllForms = async () => {
  try {
    const response = await axios.get(`${hostURL}/api/template/allForms`);

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getAllForms:..", error);

    return error.response;
  }
};

export const getAllAnswers = async (token) => {
  try {
    const response = await axios.get(`${hostURL}/api/answer`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getAllAnswers:..", error);

    return error.response;
  }
};

export const getAllAnswersByAuthor = async (token) => {
  try {
    const response = await axios.get(`${hostURL}/api/answer/byAuthor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getAllAnswersByAuthor:..", error);

    return error.response;
  }
};

export const getAnswerById = async (id, token) => {
  try {
    const response = await axios.get(`${hostURL}/api/answer/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getAnswerById:..", error);

    return error.response;
  }
};

export const getTemplatesbySearch = async (search) => {
  try {
    const response = await axios.get(
      `${hostURL}/api/template/search/${search}`
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getTemplatesbySearch:..", error);

    return error.response;
  }
};

export const getTemplatesbyTag = async (tag) => {
  try {
    //console.log("apiForm tag", tag);
    const response = await axios.get(`${hostURL}/api/template/tag/${tag}`);

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getTemplatesbyTag:..", error);

    return error.response;
  }
};

export const getDistinctTags = async () => {
  try {
    const response = await axios.get(`${hostURL}/api/template/allTags`);

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getDistinctTags:..", error);

    return error.response;
  }
};

export const getTemplateById = async (id) => {
  try {
    const response = await axios.get(`${hostURL}/api/template/${id}`);

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getTemplateById:..", error);

    return error.response;
  }
};

export const getTemplateByFilter = async (filter) => {
  try {
    const response = await axios.post(`${hostURL}/api/template/filter`, filter);

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getTemplateByFilter:..", error);

    return error.response;
  }
};

export const copyTemplate = async (id, token) => {
  try {
    const response = await axios.get(`${hostURL}/api/template/copy/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error copyTemplate:..", error);

    return error.response;
  }
};

export const createForm = async (id, token) => {
  try {
    const response = await axios.get(
      `${hostURL}/api/template/createForm/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error createForm:..", error);

    return error.response;
  }
};

export const deleteTemplate = async (id, token) => {
  try {
    const response = await axios.delete(`${hostURL}/api/template/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error deleteTemplate:..", error);

    return error.response;
  }
};

export const deleteQuestionsByTemplateId = async (id, token) => {
  try {
    const response = await axios.get(
      `${hostURL}/api/question/deleteByTemplateId/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error deleteQuestionsByTemplateId:..", error);

    return error.response;
  }
};

export const createNewQuestion = async (data, token) => {
  try {
    const response = await axios.post(`${hostURL}/api/question`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error createNewQuestion:..", error);

    return error.response;
  }
};

export const getQuestionById = async (id) => {
  try {
    const response = await axios.get(`${hostURL}/api/question/${id}`);

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getQuestionById:..", error);

    return error.response;
  }
};

export const updateQuestionApi = async (data, token) => {
  try {
    const response = await axios.patch(
      `${hostURL}/api/question/${data._id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error updateQuestion:..", error);

    return error.response;
  }
};

export const updateOrderQuestionsApi = async (data, templateId, token) => {
  try {
    const response = await axios.patch(
      `${hostURL}/api/template/order/${templateId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error updateOrderQuestionsApi:..", error);

    return error.response;
  }
};

export const deleteQuestion = async (id, token) => {
  try {
    const response = await axios.delete(`${hostURL}/api/question/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error deleteQuestion:..", error);

    return error.response;
  }
};

export const getQuestionsByTemplateId = async (id, token) => {
  try {
    const response = await axios.get(`${hostURL}/api/question/template/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getQuestionsByTemplateId:..", error);

    return error.response;
  }
};

export const getQuestionsByTemplateIdNoToken = async (id) => {
  try {
    const response = await axios.get(
      `${hostURL}/api/question/templateNoToken/${id}`
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getQuestionsByTemplateIdNoToken:..", error);

    return error.response;
  }
};

export const createNewAnswer = async (data) => {
  try {
    const response = await axios.post(`${hostURL}/api/answer`, data);

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error createNewAnswer:..", error);

    return error.response;
  }
};

export const updateAnswerById = async (data) => {
  try {
    const response = await axios.patch(
      `${hostURL}/api/answer/${data._id}`,
      data
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error updateAnswerById:..", error);

    return error.response;
  }
};

export const getAnswersByTemplateId = async (id) => {
  try {
    const response = await axios.get(
      `${hostURL}/api/answer/byTemplateId/${id}`
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getAnswersByTemplateId:..", error);

    return error.response;
  }
};
