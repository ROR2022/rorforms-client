"use client";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/navigation";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@nextui-org/react";

import { IAnswerForm } from "../SolveForm/SolveForm";
import { categories } from "../FormTemplate/HeaderForm";
//import { IBasicForm } from "../FormTemplate/BasicForm";

import { getAllAnswers, getAllAnswersByAuthor } from "@/api/apiForm";
import { LOCALSTORAGE_KEY } from "@/dataEnv/dataEnv";
import { initialState } from "@/redux/userSlice";

const columns = [
  { key: "user", label: "User" },
  { key: "form", label: "Form" },
  { key: "createdAt", label: "Creation Date" },
];

const Answers = () => {
  const [storedDataUser] = useLocalStorage(LOCALSTORAGE_KEY, initialState);
  //const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [answers, setAnswers] = useState<IAnswerForm[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    //console.log("Answers");
    if (storedDataUser.roles && storedDataUser.roles.includes("admin")) {
      //setIsAdminUser(true);
      fetchData("admin");
    } else {
      //setIsAdminUser(false);
      fetchData("user");
    }
  }, [storedDataUser]);

  const fetchData = async (role: string) => {
    const { access_token } = storedDataUser;

    if (!access_token) {
      //eslint-disable-next-line
      console.error("No access token");

      return;
    }

    try {
      setLoading(true);
      let res = null;

      if (role === "admin") {
        res = await getAllAnswers(access_token);
      } else {
        res = await getAllAnswersByAuthor(access_token);
      }
      //eslint-disable-next-line
      console.log("Res Answers:", res);

      const { data } = res;

      setLoading(false);
      if (data) {
        setAnswers([...data]);
      }
    } catch (error) {
      //eslint-disable-next-line
      console.error("Error fetching answers", error);
      setLoading(false);
    }
  };

  const renderCell = (item: IAnswerForm, columnKey: string) => {
    switch (columnKey) {
      case "user":
        const { userId } = item;

        if (typeof userId === "string") return userId;

        const { name, email, imageUrl } = userId;

        return (
          <User
            avatarProps={{ radius: "lg", src: imageUrl }}
            description={email}
            name={
              <div>
                <h6>{name}</h6>
              </div>
            }
          >
            {" "}
          </User>
        );
      case "form":
        const { templateId } = item;

        if (typeof templateId === "string") {
          return templateId;
        } else {
          const { title, imageUrl, category } = templateId;

          return (
            <User
              avatarProps={{ radius: "lg", src: imageUrl }}
              description={categories.find((c) => c.key === category)?.label}
              name={
                <div>
                  <h6>{title}</h6>
                </div>
              }
            >
              {" "}
            </User>
          );
        }
      case "createdAt":
        return new Date(item.createdAt || "").toLocaleString();
      default:
        return "No data";
    }
  };

  const handleEditAnswer = (item: IAnswerForm) => {
    //eslint-disable-next-line
    console.log("Edit Answer:..", item);
    const { templateId } = item;

    if (typeof templateId === "string") return;
    const { _id } = templateId;

    router.push(`/solve-form?id=${_id}&editId=${item._id}`);
  };

  return (
    <div>
      <h3 className="text-slate-500 text-center my-4 text-4xl">
        Answers Navigation
      </h3>
      <div className="flex justify-center">
        {loading && <CircularProgress aria-label="loading..." />}
      </div>
      <p className="text-small text-center text-gray-600 my-4">
        Answers: {answers.length}
      </p>
      {answers.length > 0 && (
        <Table aria-label="Table with custom cells">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>

          <TableBody items={answers}>
            {(item) => (
              <TableRow
                key={item._id}
                className="hover:bg-slate-800 hover:text-purple-700 cursor-pointer"
                id={item._id}
                onClick={() => handleEditAnswer(item)}
              >
                {(columnKey) => (
                  <TableCell>{renderCell(item, String(columnKey))}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Answers;
