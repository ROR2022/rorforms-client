import React, { FC, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { RadioGroup, Radio } from "@nextui-org/radio";

//import { ISelectItem } from "../FormTemplate/BasicQuestion";
import { generateUniqueId } from "../FormTemplate/BasicDrag/Container";

import { IQuestionFill } from "./ShortQuestion";
import CardUser from "./CardUser";

const MultipleQuestion: FC<IQuestionFill> = ({
  question,
  handleAnswerQuestion,
  answers,
}) => {
  const [optionSelected, setOptionSelected] = React.useState<string>("");

  useEffect(() => {
    //eslint-disable-next-line
    //console.log("MultipleQuestion:", question, answers);
    const tempAnswer = answers.find((ans) => ans.questionId === question._id);

    if (tempAnswer && typeof tempAnswer.answer === "string")
      setOptionSelected(tempAnswer.answer);
  }, []);

  const handleSelectOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setOptionSelected(value);
    const tempDataAnswer = {
      questionId: question._id || "",
      answer: value,
    };
    //eslint-disable-next-line
    console.log("tempDataAnswer:", tempDataAnswer);
    handleAnswerQuestion(tempDataAnswer.questionId, tempDataAnswer.answer);
  };

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
          <RadioGroup
            label="Select your option"
            value={optionSelected}
            onChange={handleSelectOption}
          >
            {question.listAnswers.map((item) => (
              <Radio key={generateUniqueId()} value={item.value}>
                {item.label}
              </Radio>
            ))}
          </RadioGroup>
        </div>
      </CardBody>
    </Card>
  );
};

export default MultipleQuestion;
