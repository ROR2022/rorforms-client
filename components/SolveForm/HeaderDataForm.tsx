"use client";
import React, { FC } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { User } from "@nextui-org/react";

import { IBasicForm } from "../FormTemplate/BasicForm";
import { categories } from "../FormTemplate/HeaderForm";

interface HeaderDataFormProps {
  dataTemplate: IBasicForm;
}

const HeaderDataForm: FC<HeaderDataFormProps> = ({ dataTemplate }) => {
  const labelCategory = categories.find(
    (cat) => cat.key === dataTemplate.category
  )?.label;

  return (
    <Card style={{ width: "100%" }}>
      <CardHeader>
        <div className="flex justify-center" style={{ width: "100%" }}>
          <h2 className="text-slate-500 text-4xl">Fill Form</h2>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex justify-start">
          <User
            avatarProps={{
              src: dataTemplate.imageUrl || "/formIcon.png",
              style: { width: "20vw", height: "auto" },
            }}
            description={
              <div className="">
                <p className="text-xl">
                  {dataTemplate.description || "No Description"}
                </p>
                <p className="text-xl">{labelCategory || "No Category"}</p>
              </div>
            }
            name={
              <h1 className="text-4xl font-bold">
                {dataTemplate.title || "No Title"}
              </h1>
            }
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default HeaderDataForm;
