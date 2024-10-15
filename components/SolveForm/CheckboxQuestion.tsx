import React, { FC, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";

//import { ISelectItem } from "../FormTemplate/BasicQuestion";
import { generateUniqueId } from "../FormTemplate/BasicDrag/Container";

import { IQuestionFill } from "./ShortQuestion";
import CardUser from "./CardUser";

const CheckboxQuestion: FC<IQuestionFill> = ({
  question,
  handleAnswerQuestion,
  answers,
}) => {
  const [checkboxValues, setCheckboxValues] = React.useState<string[]>([]);

  useEffect(() => {
    //eslint-disable-next-line
    //console.log("CheckboxQuestion:", question, answers);
    const tempAnswer = answers.find((ans) => ans.questionId === question._id);

    if (tempAnswer && Array.isArray(tempAnswer.answer))
      setCheckboxValues(tempAnswer.answer);
  }, []);

  const handleChangeCheckbox = (options: string[]) => {
    //eslint-disable-next-line
    console.log("Selected:", options);
    setCheckboxValues(options);
    handleAnswerQuestion(question._id || "", options);
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
          <CheckboxGroup
            label="Select your option"
            value={checkboxValues}
            onChange={handleChangeCheckbox}
          >
            {question.listAnswers.map((item) => (
              <Checkbox key={generateUniqueId()} value={item.value}>
                {item.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </div>
      </CardBody>
    </Card>
  );
};

export default CheckboxQuestion;
