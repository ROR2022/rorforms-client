import React, { FC, useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Textarea } from "@nextui-org/react";

import { IQuestionFill } from "./ShortQuestion";
import CardUser from "./CardUser";

const LongQuestion: FC<IQuestionFill> = ({
  question,
  handleAnswerQuestion,
  answers,
}) => {
  const [longAnswer, setLongAnswer] = useState<string>("");

  useEffect(() => {
    //eslint-disable-next-line
    //console.log("LongQuestion:", question, answers);
    const tempAnswer = answers.find((ans) => ans.questionId === question._id);

    if (tempAnswer && typeof tempAnswer.answer === "string")
      setLongAnswer(tempAnswer.answer);
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
          <Textarea
            placeholder="Answer here"
            value={longAnswer}
            onChange={(e) => {
              //eslint-disable-next-line
              //console.log("Answer:", e.target.value);
              const tempAnswer = e.target.value;

              if (question._id) handleAnswerQuestion(question._id, tempAnswer);
              setLongAnswer(tempAnswer);
            }}
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default LongQuestion;
