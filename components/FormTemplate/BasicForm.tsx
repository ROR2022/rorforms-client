"use client";
import React, { useState, useEffect, useRef } from "react";
//import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useLocalStorage } from "usehooks-ts";
import { useDispatch } from "react-redux";
// eslint-disable-next-line import/order
import { useSearchParams } from "next/navigation";
// eslint-disable-next-line import/order
import { useRouter } from "next/navigation";
//import { useLocalStorage } from "usehooks-ts";
//import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

//import BasicQuestion from "./BasicQuestion";
import { CircularProgress } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import Cookies from "js-cookie";

import BasicDrag from "./BasicDrag/BasicDrag";
import MiniModal from "./MiniModal";
import HeaderForm from "./HeaderForm";
import { IBasicQuestion, initQuestionValues } from "./BasicQuestion";
//import { generateUniqueId } from "./BasicDrag/Container";

import { initialState, setUser } from "@/redux/userSlice";
import { COOKIE_KEY, LOCALSTORAGE_KEY } from "@/dataEnv/dataEnv";
import {
  createNewTemplate,
  updateTemplate,
  getTemplateById,
  createNewQuestion,
  getQuestionsByTemplateId,
  deleteQuestion,
  updateQuestionApi,
  updateOrderQuestionsApi,
  getQuestionById,
  copyTemplate,
} from "@/api/apiForm";

export interface IBasicForm {
  _id?: string;
  author: string;
  title: string;
  imageUrl: string;
  description: string;
  category: string;
  tags?: string[];
  questions: string[];
  isForm?: boolean;
  isPublic?: boolean;
  usersGuest?: string[];
  fatherId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const initFormValues: IBasicForm = {
  author: "",
  title: "",
  imageUrl: "",
  description: "",
  category: "",
  questions: [],
  tags: [],
  isForm: false,
  isPublic: true,
  usersGuest: [],
  fatherId: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const BasicForm = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [formValues, setFormValues] = useState<IBasicForm>(initFormValues);
  const [dataQuestions, setDataQuestions] = useState<IBasicQuestion[]>([]);
  const [showMiniModal, setShowMiniModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  //const [isCopy, setIsCopy] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  //const language = useSelector((state: RootState) => state.user.language);
  const [storedDataUser, setStoredDataUser] = useLocalStorage(
    LOCALSTORAGE_KEY,
    initialState
  );
  const { language } = storedDataUser;
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const copyId = searchParams.get("copyId");
  let accion = editId ? "Editar" : "Crear";

  accion = copyId ? "Copiar" : accion;
  let action = editId ? "Edit" : "Create";

  action = copyId ? "Copy" : action;
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    //setLocalDataQuestions([]);
    //console.log("EditId:", editId);

    const { _id } = formValues;

    if (!_id) {
      if (editId) {
        fetchDataForm(editId);
      }
      if (copyId) {
        //fetchDataForm(copyId);
        //eslint-disable-next-line
        console.log("CopyId:", copyId);

        //copyForm(copyId);
      }
    }
  }, []);

  useEffect(() => {}, [isCreating]);

  useEffect(() => {
    //eslint-disable-next-line
    //console.log("storedDataUser: ", storedDataUser);
  }, [storedDataUser]);

  useEffect(() => {
    //eslint-disable-next-line
    //console.log("isMobile:..", isMobile);
  }, [isMobile]);

  useEffect(() => {
    //eslint-disable-next-line
    console.log("useEffect dataQuestions:", dataQuestions);
  }, [dataQuestions]);

  useEffect(() => {
    //eslint-disable-next-line
    console.log("Form values:", formValues);
  }, [formValues]);

  const copyForm = async (id: string) => {
    try {
      const { access_token } = storedDataUser;

      if (!access_token) {
        reTryLogin();

        return;
      }
      const resultCopy = await copyTemplate(id, access_token);
      //eslint-disable-next-line
      console.log("Result copy form", resultCopy);
      const { data } = resultCopy;

      if (data) {
        const { template, questions } = data;

        setFormValues({ ...template });
        setDataQuestions([...questions]);
      }
    } catch (error) {
      //eslint-disable-next-line
      console.log("Error copy form", error);
      reTryLogin();
    }
  };

  const fetchDataForm = async (id: string) => {
    //eslint-disable-next-line
    //console.log("Fetch data form", id);
    try {
      setIsCreating(true);
      const resultF = await getTemplateById(id);
      const { data: dataF } = resultF;

      if (dataF.isForm === true) {
        //eslint-disable-next-line
        console.log("Data Form is a Form");
        setIsCreating(false);
        router.push(`/solve-form?id=${id}`);

        return;
      }

      const resultQ = await getQuestionsByTemplateId(
        id,
        storedDataUser.access_token
      );
      const { data: dataQ } = resultQ;
      //eslint-disable-next-line
      console.log("result getQuestionsByTemplateId:", dataQ);

      setFormValues({ ...dataF });

      const orderedQuestions = dataF.questions.map((qId: string) => {
        const tempQ = dataQ.find((q: IBasicQuestion) => q._id === qId);

        return tempQ || initQuestionValues;
      });

      setDataQuestions([...orderedQuestions]);
      setIsCreating(false);
    } catch (error) {
      //eslint-disable-next-line
      console.log("Error fetch data form", error);
      setIsCreating(false);
      reTryLogin();
    }
  };

  const reTryLogin = () => {
    alert("Please try login again");
    dispatch(setUser(initialState));
    setStoredDataUser(initialState);
    Cookies.remove(COOKIE_KEY);
    router.push("/login");
  };

  const createNewForm = async () => {
    //eslint-disable-next-line
    console.log("Create new form");

    if (isCreating) return;

    try {
      setIsCreating(true);
      const result = await createNewTemplate(
        initFormValues,
        storedDataUser.access_token
      );
      //eslint-disable-next-line
      console.log("Result create new form", result);
      const { data } = result;

      setIsCreating(false);

      if (data) {
        setFormValues({ ...data });
      } else {
        //eslint-disable-next-line
        console.log("Error create new form", result);
      }
    } catch (error) {
      //eslint-disable-next-line
      console.log("Error create new form", error);

      setIsCreating(false);
      reTryLogin();
    }
  };

  const updateQuestion = async (dataQ: IBasicQuestion) => {
    //eslint-disable-next-line
    console.log("Update question", dataQ);
    if (!dataQ._id) {
      //eslint-disable-next-line
      console.log("No id in dataQ");
      const tempPromise: Promise<IBasicQuestion> = new Promise((resolve) => {
        resolve(initQuestionValues);
      });

      return tempPromise;
    }
    const updatePromise: Promise<IBasicQuestion> = new Promise(
      (mainResolve) => {
        setDataQuestions((prevQuestions) => {
          if (dataQ.type === "deleteQuestion") {
            deleteQuestion(dataQ._id, storedDataUser.access_token);
            const newTempQuestions = prevQuestions.filter(
              (q) => q._id !== dataQ._id
            );
            const tempIds = newTempQuestions.map((q) => q._id || "");

            updateOrderQuestionsApi(
              tempIds,
              formValues._id,
              storedDataUser.access_token
            );

            return newTempQuestions;
          }
          const firstChar = dataQ.type.charAt(0);

          if (firstChar === "+") {
            const tempQ = { ...dataQ };

            tempQ.type = tempQ.type.substring(1);
            createNewQuestion(tempQ, storedDataUser.access_token).then(
              (res) => {
                const { data } = res;

                if (data) {
                  const tempIds = prevQuestions.map((q) => q._id || "");

                  tempIds.push(data._id || "");

                  updateOrderQuestionsApi(
                    tempIds,
                    formValues._id,
                    storedDataUser.access_token
                  );
                }
              }
            );

            return [...prevQuestions, tempQ];
          }
          //console.log("Init Data prevQuestions:", prevQuestions);
          const tempQuestions = [...prevQuestions];
          const index = tempQuestions.findIndex((q) => q._id === dataQ._id);

          if (index === -1) {
            return tempQuestions;
          }
          tempQuestions[index] = { ...dataQ };
          setTimeout(() => {
            updateQuestionApi(dataQ, storedDataUser.access_token);
          }, 1000);

          setShowMiniModal(true);
          setTimeout(() => {
            setShowMiniModal(false);
          }, 500);
          //console.log("End Temp questions", tempQuestions);
          mainResolve(tempQuestions[index] || initQuestionValues);

          return tempQuestions;
        });
      }
    );

    return updatePromise;
  };

  const addNewQuestion = async () => {
    //eslint-disable-next-line
    //console.log("Father Add new question");
    if (!formValues._id || !storedDataUser.access_token) {
      //eslint-disable-next-line
      console.log("No templateId or access token");

      return;
    }
    const basicNewQuestion: IBasicQuestion = {
      ...initQuestionValues,
      templateId: formValues._id || "",
    };

    try {
      const result = await createNewQuestion(
        basicNewQuestion,
        storedDataUser.access_token
      );
      //eslint-disable-next-line
      console.log("Result add new question", result);
      const { data } = result;

      if (data) {
        setDataQuestions((prevQuestions) => {
          const tempIds =
            prevQuestions.length > 0
              ? prevQuestions.map((q) => q._id || "")
              : [];

          tempIds.push(data._id || "");

          updateOrderQuestionsApi(
            tempIds,
            formValues._id,
            storedDataUser.access_token
          );

          return [...prevQuestions, data];
        });
      } else {
        //eslint-disable-next-line
        console.log("Error adding new question", result);
      }
    } catch (error) {
      //eslint-disable-next-line
      console.log("Error add new question", error);
      reTryLogin();
    }
  };

  const handleSelectQuestion = (dataQ: IBasicQuestion) => {
    //eslint-disable-next-line
    console.log("Select question", dataQ);
    //setSelectedQuestion({ ...dataQ });
  };

  const updateFormValues = (data: IBasicForm) => {
    //eslint-disable-next-line
    console.log("Update form values, init...");
    setFormValues({ ...data });

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      if (data._id) {
        try {
          const resUpdate = updateTemplate(data, storedDataUser.access_token);
          //eslint-disable-next-line
          console.log("Update form values", resUpdate);

          setShowMiniModal(true);
          setTimeout(() => {
            setShowMiniModal(false);
          }, 500);
        } catch (error) {
          //eslint-disable-next-line
          console.log("Error update form values", error);
          reTryLogin();
        }
      } else {
        if (!isCreating) {
          //createNewForm();
          //setIsCreating(true);
        }
      }
    }, 1000);
  };

  const updateOrderQuestions = (dataIds: string[]) => {
    //eslint-disable-next-line
    //console.log("Update order questions", data);
    if (!formValues._id || !storedDataUser.access_token || !dataIds) {
      //eslint-disable-next-line
      console.log("No templateId or access token or data");

      return;
    }
    let reorderedQuestions: IBasicQuestion[] = [];

    dataIds.forEach(async (qId) => {
      const tempQ = [...dataQuestions].find((q) => q._id === qId);

      if (tempQ) {
        reorderedQuestions.push(tempQ);
      } else {
        //try to find the question in the database
        const tempQ = await getQuestionById(qId);

        const { data: dataQ } = tempQ;

        if (dataQ) {
          reorderedQuestions.push(dataQ);
        }
      }
    });

    //console.log("Reordered questions:", reorderedQuestions);
    //setDataQuestions([...reorderedQuestions]);
    updateOrderQuestionsApi(
      dataIds,
      formValues._id,
      storedDataUser.access_token
    )
      .then(() => {
        //setDataQuestions([...reorderedQuestions]);
        fetchDataForm(formValues._id || "");
      })
      .catch((error) => {
        //eslint-disable-next-line
        console.log("Error update order questions", error);
        reTryLogin();
      });
  };

  return (
    <div style={{ width: isMobile ? "90vw" : "80vw", margin: "0 auto" }}>
      <h3 className="flex justify-center mb-2 text-4xl text-slate-500">
        {language && language === "es"
          ? `${accion} Plantilla`
          : `${action} Template`}
      </h3>

      {!formValues._id && !isCreating && (
        <Button
          color="primary"
          size="sm"
          style={{
            width: "150px",
            marginTop: "20px",
            marginBottom: "20px",
            marginLeft: "auto",
            marginRight: "auto",
            display: "block",
          }}
          onClick={copyId ? () => copyForm(copyId) : createNewForm}
        >
          {language && language === "es"
            ? "Crear Plantilla"
            : "Create Template"}
        </Button>
      )}

      {isCreating && (
        <div className="flex justify-center items-center gap-2">
          <CircularProgress aria-label="Loading..." size="md" />
        </div>
      )}

      {formValues._id && (
        <HeaderForm
          addNewQuestion={addNewQuestion}
          formValues={formValues}
          updateFormValues={updateFormValues}
        />
      )}

      {showMiniModal && <MiniModal />}

      {dataQuestions.length > 0 && (
        <BasicDrag
          dataCards={dataQuestions}
          handleSelectQuestion={handleSelectQuestion}
          updateDataCard={updateQuestion}
          updateOrderQuestions={updateOrderQuestions}
        />
      )}
    </div>
  );
};

export default BasicForm;
