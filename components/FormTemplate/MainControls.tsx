"use client";
import React, { FC, useEffect } from "react";
//import { FaRegSquarePlus } from "react-icons/fa6";
import { FaRegImage } from "react-icons/fa6";
import { FaRegCopy } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { Button } from "@nextui-org/button";
import { Switch } from "@nextui-org/switch";
import { Select, SelectItem, Tooltip } from "@nextui-org/react";
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";

import { IBasicQuestion } from "./BasicQuestion";

//import { Card, CardBody } from "@nextui-org/react";
import { uploadImage } from "@/api/apiUser";
import { DataUser, RootState } from "@/redux/userSlice";

const qTypes = [
  {
    id: "1",
    value: "short",
    label: "Short Answer",
  },
  {
    id: "2",
    value: "long",
    label: "Long Answer",
  },
  {
    id: "3",
    value: "multiple",
    label: "Multiple Choice",
  },
  {
    id: "4",
    value: "checkbox",
    label: "Checkbox",
  },
  {
    id: "5",
    value: "numeric",
    label: "Numeric",
  },
];

interface MainControlsProps {
  activeQuestion: IBasicQuestion;
  updateQuestion: (dataQ: IBasicQuestion) => void;
}

const MainControls: FC<MainControlsProps> = ({
  activeQuestion,
  updateQuestion,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  //const [image, setImage] = useState<File | null | string>(null);
  const user: DataUser = useSelector((state: RootState) => state.user);

  useEffect(() => {
    //eslint-disable-next-line
    //console.log("isMobile:..", isMobile);
  }, [isMobile]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    //eslint-disable-next-line
    //console.log("Add image", e.target.files);
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];

      if (file) {
        //setImage(file);
        handleUploadImage(file);
      }
    }
  };

  const handleUploadImage = async (file: File) => {
    //eslint-disable-next-line
    console.log("Upload image:", file);
    if (!user.access_token) {
      //eslint-disable-next-line
      console.log("No access token");
      alert("No access token");

      return;
    }
    try {
      const tempFormData = new FormData();

      tempFormData.append("file", file);

      const response = await uploadImage(tempFormData, user.access_token);
      //eslint-disable-next-line
      console.log("Response:", response);
      const { data } = response;

      if (data) {
        updateQuestion({ ...activeQuestion, imageUrl: data });
      }
    } catch (error) {
      //eslint-disable-next-line
      console.log("Error uploading image:", error);
    }
  };
  const handleCopy = () => {
    //eslint-disable-next-line
    console.log("Copy question");
    updateQuestion({ ...activeQuestion, type: `+${activeQuestion.type}` });
  };
  const handleTrash = () => {
    //eslint-disable-next-line
    console.log("Delete question");
    updateQuestion({ ...activeQuestion, type: "deleteQuestion" });
  };
  const handleRequired = (e: React.ChangeEvent<HTMLInputElement>) => {
    //eslint-disable-next-line
    console.log("Toggle required", e.target.checked);

    updateQuestion({ ...activeQuestion, required: e.target.checked });
  };
  const handleSelectType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //eslint-disable-next-line
    console.log("Select question type", e.target.value);
    const tempType = e.target.value;

    if (tempType === "multiple") {
      const tempOptions = [{ value: "option1", label: "Option1" }];

      updateQuestion({
        ...activeQuestion,
        type: tempType,
        listAnswers: tempOptions,
      });
    }

    if (tempType === "checkbox") {
      const tempOptions = [{ value: "value1", label: "Value1" }];

      updateQuestion({
        ...activeQuestion,
        type: tempType,
        listAnswers: tempOptions,
      });
    }

    if (tempType === "numeric" || tempType === "short" || tempType === "long") {
      updateQuestion({ ...activeQuestion, type: tempType });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: isMobile ? "center" : "space-between",
        alignItems: isMobile ? "flex-start" : "center",
        gap: "10px",
        backgroundColor: "inherit",
        color: "inherit",
        margin: "0",
      }}
    >
      <Tooltip content="Add image" placement="top">
        <div style={{ width: "80px", height: "40px", marginBottom: "10px" }}>
          <label
            aria-label="Add image"
            htmlFor={`fileImageQuestion${activeQuestion._id}`}
          >
            <div
              className="cursor-pointer my-2 flex justify-center items-center text-purple-700 hover:bg-gray-500 rounded-2xl"
              style={{ width: "80px", height: "40px", paddingBottom: "5px" }}
            >
              <FaRegImage />
            </div>
          </label>
          <input
            accept="image/*"
            id={`fileImageQuestion${activeQuestion._id}`}
            style={{
              display: "none",
              width: "100px",
              height: "50px",
              position: "absolute",
              top: "0px",
              left: "0px",
            }}
            type="file"
            onChange={handleImage}
          />
        </div>
      </Tooltip>
      <Tooltip content="Duplicate" placement="top">
        <Button
          color="secondary"
          radius="md"
          size="md"
          variant="light"
          onClick={handleCopy}
        >
          <FaRegCopy />
        </Button>
      </Tooltip>
      <Tooltip content="Delete" placement="top">
        <Button
          color="secondary"
          radius="md"
          size="md"
          variant="light"
          onClick={handleTrash}
        >
          <FaTrashAlt />
        </Button>
      </Tooltip>
      <Tooltip content="Required" placement="top">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100px",
          }}
        >
          <Switch
            color="secondary"
            isSelected={activeQuestion.required}
            size="sm"
            onChange={handleRequired}
          />
        </div>
      </Tooltip>
      <Select
        className="flex justify-center"
        label="Type"
        style={{ width: isMobile ? "100px" : "120px" }}
        onChange={handleSelectType}
      >
        {qTypes.map((qType) => (
          <SelectItem key={qType.value}>{qType.label}</SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default MainControls;
