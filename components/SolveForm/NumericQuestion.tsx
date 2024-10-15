import React, { FC, useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Input } from "@nextui-org/react";

import { IQuestionFill } from "./ShortQuestion";
import CardUser from "./CardUser";

const NumericQuestion: FC<IQuestionFill> = ({
  question,
  handleAnswerQuestion,
  answers,
}) => {
  const [numericAnswer, setNumericAnswer] = useState<number>(0);

  useEffect(() => {
    //eslint-disable-next-line
    //console.log("NumericQuestion:", question, answers);
    const tempAnswer = answers.find((ans) => ans.questionId === question._id);

    if (tempAnswer && typeof tempAnswer.answer === "string")
      setNumericAnswer(Number(tempAnswer.answer));
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
            type="number"
            value={String(numericAnswer)}
            onChange={(e) => {
              //eslint-disable-next-line
              //console.log("Answer:", e.target.value);
              const tempAnswer = e.target.value;

              if (question._id) handleAnswerQuestion(question._id, tempAnswer);

              setNumericAnswer(Number(e.target.value));
            }}
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default NumericQuestion;
