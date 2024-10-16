"use client";
import React, { useEffect, useRef, useState, Suspense, FC } from "react";
//import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { useSearchParams } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";

import { IBasicForm } from "../FormTemplate/BasicForm";
import { IBasicQuestion } from "../FormTemplate/BasicQuestion";
import MiniModal from "../FormTemplate/MiniModal";

import HeaderDataForm from "./HeaderDataForm";
import ShortQuestion from "./ShortQuestion";
import LongQuestion from "./LongQuestion";
import MultipleQuestion from "./MultipleQuestion";
import CheckboxQuestion from "./CheckboxQuestion";
import NumericQuestion from "./NumericQuestion";
import TableAnswers from "./TableAnswers";

import {
  getTemplateById,
  getQuestionsByTemplateIdNoToken,
  createNewAnswer,
  updateAnswerById,
  getAnswerById,
} from "@/api/apiForm";
import { LOCALSTORAGE_KEY, ROLE_ADMIN } from "@/dataEnv/dataEnv";
import { DataUser, initialState } from "@/redux/userSlice";

export interface IAnswer {
  questionId: string;
  answer: string | string[];
}

export interface IAnswerForm {
  _id: string;
  templateId: string | IBasicForm;
  answers: Array<IAnswer>;
  userEmail: string;
  userName: string;
  userId: string | DataUser;
  createdAt?: string;
}

export const initAnswerForm: IAnswerForm = {
  _id: "",
  templateId: "",
  answers: [],
  userEmail: "",
  userName: "",
  userId: "",
};

interface IGetMyParams {
  setMyTemplateId: (value: string) => void;
  setAnswerEditId: (value: string) => void;
}

const GetMyParams: FC<IGetMyParams> = ({
  setMyTemplateId,
  setAnswerEditId,
}) => {
  const searchParams = useSearchParams();
  const myTemplateId = searchParams.get("id");
  const answerEditId = searchParams.get("editId");

  useEffect(() => {
    if (myTemplateId) setMyTemplateId(myTemplateId);
    if (answerEditId) setAnswerEditId(answerEditId);
  }, []);

  return <div style={{ display: "none" }}>{myTemplateId}</div>;
};

const SolveForm = () => {
  //const router = useRouter();
  //const searchParams = useSearchParams();
  //const myTemplateId = searchParams.get("id");
  //const answerEditId = searchParams.get("editId");
  const [myTemplateId, setMyTemplateId] = useState<string | null>(null);
  const [answerEditId, setAnswerEditId] = useState<string | null>(null);
  const isSmallScreen = useMediaQuery({ query: "(max-width: 500px)" });
  const [dataAnswerForm, setDataAnswerForm] =
    useState<IAnswerForm>(initAnswerForm);
  const [dataTemplate, setDataTemplate] = useState<IBasicForm | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingQuestionId, setUpdatingQuestionId] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isEditing, setIsEditing] = useState<IAnswerForm | null>(null);
  const [dataAnswers, setDataAnswers] = useState<IAnswer[]>([]);
  const [showTableAnswers, setShowTableAnswers] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>("en");
  const [storedDataUser] = useLocalStorage(LOCALSTORAGE_KEY, initialState);
  const [dataQuestions, setDataQuestions] = useState<IBasicQuestion[] | null>(
    null
  );
  //eslint-disable-next-line
  //console.log("myTemplateId", myTemplateId);

  useEffect(() => {
    if (storedDataUser && storedDataUser.language) {
      setSelectedLanguage(storedDataUser.language);
    }
  }, [storedDataUser]);

  useEffect(() => {
    //fetchData();
    if (myTemplateId) {
      fetchData();
      //handleShowTableAnswers();
      if (!answerEditId) {
        setDataAnswerForm({
          ...initAnswerForm,
          userEmail: storedDataUser.email,
          userName: storedDataUser.name || "",
          userId: storedDataUser._id || "",
        });
      } else {
        fetchDataAnswerEdit();
      }
    }
  }, [myTemplateId]);

  useEffect(() => {
    if (answerEditId) {
      fetchDataAnswerEdit();
    }
  }, [answerEditId]);

  useEffect(() => {}, [isSmallScreen]);
  useEffect(() => {}, [updatingQuestionId]);
  useEffect(() => {
    if (isEditing) {
      //eslint-disable-next-line
      console.log("isEditing:", isEditing);
      setDataAnswerForm({ ...isEditing });
      setDataAnswers([...isEditing.answers]);
      //handleSetDataAnswerForm(isEditing);
    }
  }, [isEditing]);

  /* const handleSetDataAnswerForm = (dataAnswer: IAnswerForm | null) => {
    if (dataAnswer) {
      setDataAnswerForm(dataAnswer);
      const { answers } = dataAnswer;

      if (answers && dataQuestions) {
        const tempDataQuestions = [...dataQuestions];

        tempDataQuestions.forEach((q) => {
          const foundAnswer = answers.find((a) => a.questionId === q._id);

          if (foundAnswer) {
            if (foundAnswer.answer instanceof Array) {
              //q.listAnswers = foundAnswer.answer.value;
            }
          }
        });
      }
    }
  }; */

  const fetchData = async () => {
    try {
      const resTemplate = await getTemplateById(myTemplateId);
      const resQuestions = await getQuestionsByTemplateIdNoToken(myTemplateId);

      //eslint-disable-next-line
      //console.log("Results: ", resTemplate, resQuestions);
      let orderQuestions: string[] = [];

      if (resTemplate?.data) {
        const tempTemplate = resTemplate.data;

        orderQuestions = [...tempTemplate?.questions];
        const { author } = tempTemplate;

        handleShowTableAnswers(author);
        setDataTemplate(tempTemplate);
      }
      if (resQuestions && resQuestions.data) {
        const tempQuestions = resQuestions.data;
        let orderedQuestions: IBasicQuestion[] = [];

        orderQuestions.forEach((idQ) => {
          const foundQ = tempQuestions?.find(
            (q: IBasicQuestion) => q._id === idQ
          );

          if (foundQ) {
            orderedQuestions.push(foundQ);
          }
        });
        setDataQuestions(orderedQuestions);
      }
    } catch (error) {
      //eslint-disable-next-line
      console.error("Error fetching data", error);
    }
  };

  const fetchDataAnswerEdit = async () => {
    try {
      setLoading(true);
      const resDataAnswer = await getAnswerById(answerEditId || "");
      //eslint-disable-next-line
      console.log("Res Data Answer Edit:", resDataAnswer);
      const { data } = resDataAnswer;

      setLoading(false);
      if (data) {
        setIsEditing(data);
      }
    } catch (error) {
      //eslint-disable-next-line
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  const handleShowTableAnswers = (author: string) => {
    const { access_token, _id, roles } = storedDataUser;

    if (!access_token) {
      //eslint-disable-next-line
      console.error("No access token");

      return;
    }
    const isAuthor = author === _id;
    const isAdmin = roles?.includes(ROLE_ADMIN);

    if (isAuthor || isAdmin) {
      setShowTableAnswers(true);

      return;
    }

    //eslint-disable-next-line
    console.error("Not permission to show table answers");
    //setShowTableAnswers(true);
  };

  const handleAnswerQuestion = async (
    questionId: string,
    answer: string | string[]
  ) => {
    const typeQuestionFound = dataQuestions?.find(
      (q) => q._id === questionId
    )?.type;

    //eslint-disable-next-line
    console.log("Type Question Found:", typeQuestionFound);

    /* const tempTypeUpdating = {
      typeUpdating: typeQuestionFound || "",
      questionId,
    }; */

    setUpdatingQuestionId(questionId || "");

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      //handleAnswerQuestion(questionId, answer);

      //eslint-disable-next-line
      console.log("Father Answering:", questionId, answer);
      let tempDataAnswerForm = { ...dataAnswerForm };

      if (!dataAnswerForm._id) {
        //eslint-disable-next-line
        console.error("No answer form id");

        return;
      }
      setDataAnswerForm((prev) => {
        let tempAnswers = [...prev.answers];
        let foundAnswer = tempAnswers.find((a) => a.questionId === questionId);

        if (foundAnswer) {
          foundAnswer.answer = answer;
        } else {
          tempAnswers.push({ questionId, answer });
        }
        const newDataAnswerForm = { ...prev, answers: tempAnswers };

        tempDataAnswerForm = { ...newDataAnswerForm };

        return newDataAnswerForm;
      });
      try {
        const resultUpdate = await updateAnswerById(tempDataAnswerForm);
        //eslint-disable-next-line
        console.log("Result update:", resultUpdate);
        const { data } = resultUpdate;

        setUpdatingQuestionId("");
        if (data) {
          setOpenModal(true);
          setTimeout(() => {
            setOpenModal(false);
          }, 1000);
        }
      } catch (error) {
        //eslint-disable-next-line
        console.error("Error updating answer", error);
        setUpdatingQuestionId("");
      }
    }, 1500);
  };

  const handlePressCreate = async () => {
    //eslint-disable-next-line
    //console.log("Create New Answer Form");

    if (!dataAnswerForm.userName || !dataAnswerForm.userEmail) {
      setErrorMessage("Please enter your name and email");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);

      return;
    }
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!regexEmail.test(dataAnswerForm.userEmail)) {
      setErrorMessage("Please enter a valid email");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);

      return;
    }

    if (dataAnswerForm.userName.length < 3) {
      setErrorMessage("Please enter a valid name (3 letters min)");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);

      return;
    }
    //console.log("Create New Answer Form", dataAnswerForm);
    try {
      setLoading(true);
      //eslint-disable-next-line
      const { _id, ...myDataNewAnswer } = dataAnswerForm;

      if (!myTemplateId || !storedDataUser._id) {
        //eslint-disable-next-line
        console.error("No template id or user id");

        return;
      }
      myDataNewAnswer.templateId = myTemplateId;
      myDataNewAnswer.userId = storedDataUser._id || "";
      const res = await createNewAnswer({ ...myDataNewAnswer });
      const { data } = res;

      if (data) {
        setDataAnswerForm(data);
      }
      setLoading(false);
    } catch (error) {
      //eslint-disable-next-line
      console.error("Error creating new answer form", error);

      setLoading(false);
    }
  };

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <GetMyParams
          setAnswerEditId={setAnswerEditId}
          setMyTemplateId={setMyTemplateId}
        />
      </Suspense>
      {!answerEditId && !dataAnswerForm._id && (
        <div>
          <Card>
            <CardHeader>
              <div
                className="flex flex-col gap-2 justify-center items-center"
                style={{
                  width: "100%",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <h2
                  className={
                    isSmallScreen
                      ? "text-slate-700 text-2xl"
                      : "text-slate-700 text-4xl"
                  }
                >
                  {selectedLanguage === "en"
                    ? "Create New Response"
                    : "Crear Nueva Respuesta"}
                </h2>
                {/* <p className="text-slate-700 text-small">
                  please enter your data
                </p> */}
              </div>
            </CardHeader>
            <CardBody>
              <div
                className="flex flex-col gap-2 justify-center items-center"
                style={{
                  width: "100%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  padding: "10%",
                }}
              >
                <Input
                  isDisabled={true}
                  placeholder="Your Name"
                  value={dataAnswerForm.userName}
                  onChange={(e) => {
                    const tempData = e.target.value;

                    setDataAnswerForm((prev) => ({
                      ...prev,
                      userName: tempData,
                    }));
                  }}
                />
                <Input
                  isDisabled={true}
                  placeholder="Your Email"
                  value={dataAnswerForm.userEmail}
                  onChange={(e) => {
                    const tempData = e.target.value;

                    setDataAnswerForm((prev) => ({
                      ...prev,
                      userEmail: tempData,
                    }));
                  }}
                />
                <Button
                  color="secondary"
                  isDisabled={loading}
                  variant="solid"
                  onPress={handlePressCreate}
                >
                  {loading && <CircularProgress aria-label="loading..." />}
                  {!loading && "Create"}
                </Button>
                {errorMessage && (
                  <p className="text-red-500 text-small">{errorMessage}</p>
                )}
              </div>
            </CardBody>
          </Card>
          {showTableAnswers && (
            <TableAnswers
              setIsEditing={setIsEditing}
              templateId={myTemplateId || ""}
            />
          )}
        </div>
      )}
      {openModal && <MiniModal />}
      {dataAnswerForm._id && (
        <div>
          <div className="flex justify-center my-4">
            {loading && <CircularProgress aria-label="loading..." />}
          </div>
          <div>
            <h3>{isEditing ? "Editing " : "Creating "} Response</h3>
            <h5>{dataAnswerForm.userName}</h5>
            <p>{dataAnswerForm.userEmail}</p>
            <p>Created At: {dataAnswerForm.createdAt?.toLocaleLowerCase()}</p>
          </div>
          {dataTemplate && <HeaderDataForm dataTemplate={dataTemplate} />}
          {dataQuestions && dataQuestions.length > 0 && (
            <div className="flex flex-col justify-center gap-3 my-4">
              {dataQuestions.map((question: IBasicQuestion, index: number) => {
                switch (question.type) {
                  case "short":
                    return (
                      <div key={question._id}>
                        <div className="flex justify-center">
                          {updatingQuestionId === question._id && (
                            <CircularProgress aria-label="loading..." />
                          )}
                        </div>
                        <ShortQuestion
                          answers={dataAnswers}
                          handleAnswerQuestion={handleAnswerQuestion}
                          question={question}
                        />
                      </div>
                    );
                  case "long":
                    return (
                      <div key={question._id}>
                        <div className="flex justify-center">
                          {updatingQuestionId === question._id && (
                            <CircularProgress aria-label="loading..." />
                          )}
                        </div>
                        <LongQuestion
                          answers={dataAnswers}
                          handleAnswerQuestion={handleAnswerQuestion}
                          question={question}
                        />
                      </div>
                    );
                  case "multiple":
                    return (
                      <div key={question._id}>
                        <div className="flex justify-center">
                          {updatingQuestionId === question._id && (
                            <CircularProgress aria-label="loading..." />
                          )}
                        </div>
                        <MultipleQuestion
                          answers={dataAnswers}
                          handleAnswerQuestion={handleAnswerQuestion}
                          question={question}
                        />
                      </div>
                    );
                  case "checkbox":
                    return (
                      <div key={question._id}>
                        <div className="flex justify-center">
                          {updatingQuestionId === question._id && (
                            <CircularProgress aria-label="loading..." />
                          )}
                        </div>
                        <CheckboxQuestion
                          answers={dataAnswers}
                          handleAnswerQuestion={handleAnswerQuestion}
                          question={question}
                        />
                      </div>
                    );
                  case "numeric":
                    return (
                      <div key={question._id}>
                        <div className="flex justify-center">
                          {updatingQuestionId === question._id && (
                            <CircularProgress aria-label="loading..." />
                          )}
                        </div>
                        <NumericQuestion
                          answers={dataAnswers}
                          handleAnswerQuestion={handleAnswerQuestion}
                          question={question}
                        />
                      </div>
                    );
                  default:
                    return <h1 key={index}>No question type</h1>;
                }
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SolveForm;
