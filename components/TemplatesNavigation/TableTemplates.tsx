import React, { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
} from "@nextui-org/react";

import { IBasicForm } from "../FormTemplate/BasicForm";
import { categories } from "../FormTemplate/HeaderForm";

import MenuCardOptions from "./MenuCardOptions";
import MessageModal from "./MessageModal";
import { IDataModal, initDataModal } from "./CardTemplate";

import { LOCALSTORAGE_KEY, ROLE_ADMIN } from "@/dataEnv/dataEnv";
import { initialState } from "@/redux/userSlice";
import { deleteQuestionsByTemplateId, deleteTemplate } from "@/api/apiForm";
import BottomCardTemplate from "../Likes/BottomCardTemplate";

const columns = [
  { name: "TITLE", uid: "title" },
  { name: "DESCRIPTION", uid: "description" },
  { name: "CATEGORY", uid: "category" },
  { name: "CREATED AT", uid: "createdAt" },
  { name: "MENU", uid: "menu" },
  { name: "LIKES- COMMENTS", uid: "actions" },
];

interface IBasicFormTemplate {
  id: string | undefined;
  author: string;
  title: string;
  imageUrl: string;
  description: string;
  category: string;
  questions: string[];
  createdAt: Date;
  updatedAt: Date;
  [key: string]: string | Date | string[] | undefined;
}

interface TableTemplatesProps {
  templates: IBasicForm[];
  isForms?: boolean;
}

const TableTemplates: FC<TableTemplatesProps> = ({ templates, isForms }) => {
  const router = useRouter();
  const [storedDataUser] = useLocalStorage(LOCALSTORAGE_KEY, initialState);
  const [dataModal, setDataModal] = useState<IDataModal>(initDataModal);
  const [parsedTemplates, setParsedTemplates] = useState<IBasicFormTemplate[]>(
    []
  );

  useEffect(() => {
    const tempData = parseData(templates);

    setParsedTemplates(tempData);
  }, [templates]);

  const parseData = (data: IBasicForm[]): IBasicFormTemplate[] => {
    const tempData: IBasicFormTemplate[] = data.map((item) => {
      return {
        id: item._id,
        author: item.author,
        title: item.title,
        imageUrl: item.imageUrl,
        description: item.description,
        category: item.category,
        questions: item.questions,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    return tempData;
  };

  const handleEditTemplate = (template: IBasicFormTemplate) => {
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

    router.push(`/create-template?editId=${template.id}`);
  };

  const handleDeleteTemplate = async (template: IBasicFormTemplate) => {
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
        template.id,
        storedDataUser.access_token
      );
      const resDeleteTemplate = await deleteTemplate(
        template.id,
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

  const handleSolveTemplate = (template: IBasicFormTemplate) => {
    //console.log("Solve Template:", template);
    router.push(`/solve-form?id=${template.id}`);
  };

  const handleCopyTemplate = (template: IBasicFormTemplate) => {
    //eslint-disable-next-line
    console.log("Copy Template:", template);
    router.push(`/create-template?copyId=${template.id}`);
  };

  const renderCell = React.useCallback(
    (template: IBasicFormTemplate, columnKey: string) => {
      //const cellValue = template[columnKey];
      const { id, ...rest } = template;
      const tempTemplate = { ...rest, _id: id };

      switch (columnKey) {
        case "title":
          return (
            <User
              avatarProps={{ radius: "lg", src: template.imageUrl }}
              description=" "
              name={
                <div>
                  <h6>{template.title}</h6>
                </div>
              }
            >
              {" "}
            </User>
          );
        case "description":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {template.description}
              </p>
            </div>
          );
        case "category":
          return (
            <Chip
              className="capitalize"
              color="default"
              size="sm"
              variant="flat"
            >
              {categories.find((cat) => cat.key === template.category)?.label}
            </Chip>
          );
        case "createdAt":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {new Date(template.createdAt).toLocaleString()}
              </p>
            </div>
          );
        case "menu":
          return (
            <MenuCardOptions
              isForm={isForms}
              onCopy={() => handleCopyTemplate(template)}
              onDelete={() => handleDeleteTemplate(template)}
              onEdit={() => handleEditTemplate(template)}
              onSolve={() => handleSolveTemplate(template)}
            />
          );
        case "actions":
          return (
            <div style={{ minWidth: "250px" }}>
              <BottomCardTemplate template={tempTemplate} />
            </div>
          );
        default:
          return <span>default</span>;
      }
    },
    []
  );

  return (
    <>
      {dataModal.type !== "" && (
        <MessageModal
          message={dataModal.message}
          title={dataModal.title}
          type={dataModal.type}
        />
      )}
      <Table aria-label="Table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody items={parsedTemplates}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, String(columnKey))}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default TableTemplates;
