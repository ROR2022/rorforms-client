"use client";
import React, { FC, useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Input } from "@nextui-org/react";

import { IBasicQuestion } from "../FormTemplate/BasicQuestion";

import CardUser from "./CardUser";
import { IAnswer } from "./SolveForm";

export interface IQuestionFill {
  question: IBasicQuestion;
  handleAnswerQuestion: (questionId: string, answer: any) => void;
  answers: IAnswer[];
}

const ShortQuestion: FC<IQuestionFill> = ({
  question,
  handleAnswerQuestion,
  answers,
}) => {
  const [shortAnswer, setShortAnswer] = useState<string>("");

  useEffect(() => {
    //eslint-disable-next-line
    //console.log("ShortQuestion: ", question, answers);
    const tempAnswer = answers.find((ans) => ans.questionId === question._id);

    if (tempAnswer && typeof tempAnswer.answer === "string")
      setShortAnswer(tempAnswer.answer);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardUser
          description={question.required ? "Required" : "No Required"}
          imageUrl={question.imageUrl}
          name={question.title}
        />
      </CardHeader>
      <CardBody>
        <div className="flex justify-center">
          <Input
            placeholder="Answer here"
            value={shortAnswer}
            onChange={(e) => {
              //eslint-disable-next-line
              //console.log("Answer:", e.target.value);
              const tempAnswer = e.target.value;

              if (question._id) handleAnswerQuestion(question._id, tempAnswer);
              setShortAnswer(tempAnswer);
            }}
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default ShortQuestion;
