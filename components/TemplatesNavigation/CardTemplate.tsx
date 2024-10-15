"use client";
import React, { FC, useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";

import { IBasicForm } from "../FormTemplate/BasicForm";
import { categories } from "../FormTemplate/HeaderForm";
import BottomCardTemplate from "../Likes/BottomCardTemplate";

import MenuCardOptions from "./MenuCardOptions";
import MessageModal from "./MessageModal";

import { deleteTemplate, deleteQuestionsByTemplateId } from "@/api/apiForm";
import { LOCALSTORAGE_KEY, ROLE_ADMIN } from "@/dataEnv/dataEnv";
import { initialState } from "@/redux/userSlice";

interface ICardTemplate {
  template: IBasicForm;
  isForm?: boolean;
}

export const initDataModal = {
  type: "",
  title: "",
  message: "",
};

export interface IDataModal {
  type: string;
  title: string;
  message: string;
}

const CardTemplate: FC<ICardTemplate> = ({ template, isForm }) => {
  const { title, description, category, imageUrl } = template;
  const labelCategory = categories.find((cat) => cat.key === category)?.label;
  const router = useRouter();
  const [storedDataUser] = useLocalStorage(LOCALSTORAGE_KEY, initialState);
  const [dataModal, setDataModal] = useState<IDataModal>(initDataModal);

  useEffect(() => {
    //console.log("CardTemplate storedDataUser:", storedDataUser);
    console.log("CardTemplate isForm:", isForm);
  }, []);

  const handleEditTemplate = () => {
    //console.log("Click Template:", template);
    if (!storedDataUser.access_token) {
      //eslint-disable-next-line
      console.error("No access token");

      //alert("No access token");
      router.push("/error");

      return;
    }
    const { _id, roles } = storedDataUser;
    const isAuthor = template.author === _id;
    const isAdmin = roles?.includes(ROLE_ADMIN);

    if (!isAuthor && !isAdmin) {
      //alert("You don't have permission to edit this template");
      //eslint-disable-next-line
      console.log("You don't have permission to edit this template");

      setDataModal({
        type: "danger",
        title: "Permission Denied",
        message: "You don't have permission to edit this template",
      });

      setTimeout(() => {
        setDataModal(initDataModal);
      }, 2000);

      return;
    }

    router.push(`/create-template?editId=${template._id}`);
  };

  const handleDeleteTemplate = async () => {
    //console.log("Delete Template:", template);
    if (!storedDataUser.access_token) {
      //eslint-disable-next-line
      console.error("No access token");

      //alert("No access token");
      router.push("/error");

      return;
    }
    const { _id, roles } = storedDataUser;
    const isAuthor = template.author === _id;
    const isAdmin = roles?.includes(ROLE_ADMIN);

    if (!isAuthor && !isAdmin) {
      //alert("You don't have permission to delete this template");
      setDataModal({
        type: "danger",
        title: "Permission Denied",
        message: "You don't have permission to delete this template",
      });

      setTimeout(() => {
        setDataModal(initDataModal);
      }, 2000);

      return;
    }

    const confirmDelete = confirm(
      "Are you sure you want to delete this template?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const resDeleteQuestions = await deleteQuestionsByTemplateId(
        template._id,
        storedDataUser.access_token
      );
      const resDeleteTemplate = await deleteTemplate(
        template._id,
        storedDataUser.access_token
      );
      //eslint-disable-next-line
      console.log("Delete Results: ", resDeleteTemplate, resDeleteQuestions);
      router.refresh();
      window.location.reload();
    } catch (error) {
      //eslint-disable-next-line
      console.error("Error deleting template", error);
    }
  };

  const handleSolveTemplate = () => {
    //console.log("Solve Template:", template);
    router.push(`/solve-form?id=${template._id}`);
  };

  const handleCopyTemplate = () => {
    //eslint-disable-next-line
    console.log("Copy Template:", template);
    router.push(`/create-template?copyId=${template._id}`);
  };

  

  return (
    <Card className="py-4" style={{ width: "350px", height: "500px" }}>
      <MenuCardOptions
        isForm={isForm}
        onCopy={handleCopyTemplate}
        onDelete={handleDeleteTemplate}
        onEdit={handleEditTemplate}
        onSolve={handleSolveTemplate}
      />
      {dataModal.type !== "" && (
        <MessageModal
          message={dataModal.message}
          title={dataModal.title}
          type={dataModal.type}
        />
      )}
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h5 className="text-lg font-semibold">{title || "No Title"}</h5>
        <p className="text-sm text-gray-500">
          {description || "No Description"}
        </p>
        <p className="text-sm text-gray-500">
          {labelCategory || "No Category"}
        </p>
      </CardHeader>
      <CardBody className="overflow-visible py-2 flex justify-center">
        <Image
          alt="Card background"
          className="object-contain rounded-xl"
          height={300}
          src={imageUrl || "/formIcon.png"}
          width={270}
        />
        <BottomCardTemplate template={template} />
      </CardBody>
    </Card>
  );
};

export default CardTemplate;
