"use client";
import React, { FC, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { CiViewTable } from "react-icons/ci";
import { IoGridOutline } from "react-icons/io5";
import { Button } from "@nextui-org/button";

import { IBasicForm } from "../FormTemplate/BasicForm";

import CardTemplate from "./CardTemplate";
import FilterTemplates, { IFilter } from "./FilterTemplates";
import TableTemplates from "./TableTemplates";

import {
  getAllTemplates,
  getTemplateByFilter,
  getAllForms,
} from "@/api/apiForm";
import { LOCALSTORAGE_KEY } from "@/dataEnv/dataEnv";
import { initialState } from "@/redux/userSlice";

interface IShowTemplates {
  isForms?: boolean;
}

const ShowTemplates: FC<IShowTemplates> = ({ isForms }) => {
  const [templates, setTemplates] = useState<IBasicForm[]>([]);
  const [modeShowTemplates, setModeShowTemplates] = useState<boolean>(true);
  //const [isfFilter, setIsFilter] = useState<boolean>(false);
  const [storedDataUser] = useLocalStorage(LOCALSTORAGE_KEY, initialState);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const response = isForms ? await getAllForms() : await getAllTemplates();
    //console.log("response:", response);
    const tempTemplates = [...response.data];
    let allowedTemplates: IBasicForm[] = [];

    tempTemplates.forEach((template: IBasicForm) => {
      const isAlready = allowedTemplates.find((t) => t._id === template._id);

      if (isAlready) return;
      const { roles } = storedDataUser;
      const isAdmin = roles?.find((role) => role === "admin");

      if (isAdmin) {
        allowedTemplates.push(template);

        return;
      }

      if (template.isPublic === true) {
        allowedTemplates.push(template);

        return;
      }
      const { author, usersGuest } = template;

      if (author === storedDataUser._id) {
        allowedTemplates.push(template);

        return;
      }
      const isGuest = usersGuest?.find((user) => user === storedDataUser._id);

      if (isGuest) {
        allowedTemplates.push(template);

        return;
      }
    });

    setTemplates([...allowedTemplates]);
  };

  const handleSetDataFilter = async (filter: IFilter) => {
    //eslint-disable-next-line
    console.log("Filter:", filter);
    //check if filter is empty
    if (
      filter.category.key === "" &&
      filter.owner.key === "" &&
      filter.search === ""
    ) {
      //setIsFilter(false);

      return;
    }

    //setIsFilter(true);

    try {
      const tempDataFilter = {
        ...filter,
        userId: storedDataUser._id || "",
        isForms: isForms,
      };
      const resultFilter = await getTemplateByFilter(tempDataFilter);
      //eslint-disable-next-line
      console.log("Result Filter:", resultFilter);
      const { data } = resultFilter;

      if (data) {
        const tempTemplates = [...data];
        let allowedTemplates: IBasicForm[] = [];

        tempTemplates.forEach((template: IBasicForm) => {
          const isAlready = allowedTemplates.find(
            (t) => t._id === template._id
          );

          if (isAlready) return;
          const { roles } = storedDataUser;
          const isAdmin = roles?.find((role) => role === "admin");

          if (isAdmin) {
            allowedTemplates.push(template);

            return;
          }

          if (template.isPublic === true) {
            allowedTemplates.push(template);

            return;
          }
          const { author, usersGuest } = template;

          if (author === storedDataUser._id) {
            allowedTemplates.push(template);

            return;
          }
          const isGuest = usersGuest?.find(
            (user) => user === storedDataUser._id
          );

          if (isGuest) {
            allowedTemplates.push(template);

            return;
          }
        });

        setTemplates([...allowedTemplates]);
      }
    } catch (error) {
      //eslint-disable-next-line
      console.error("Error setting data filter:", error);
    }
  };

  return (
    <div>
      <FilterTemplates
        fetchTemplates={fetchTemplates}
        handleSetDataFilter={handleSetDataFilter}
      />
      {templates.length === 0 && (
        <div>
          <div className="flex justify-center items-center h-96">
            <h6 className="font-bold text-indigo-700 text-2xl">
              No templates found
            </h6>
          </div>
        </div>
      )}
      {templates.length > 0 && (
        <div>
          <div className="flex gap-2 justify-center items-center my-2">
            <p className="text-small text-gray-600">
              {isForms ? "Forms: " : "Templates: "} {templates.length}
            </p>
            <Button onClick={() => setModeShowTemplates((prev) => !prev)}>
              {modeShowTemplates ? <CiViewTable /> : <IoGridOutline />}
            </Button>
          </div>
          {modeShowTemplates === true && (
            <TableTemplates isForms={isForms} templates={templates} />
          )}

          {modeShowTemplates === false && (
            <div className="flex flex-wrap justify-center items-center gap-2 my-4 pt-2">
              {templates.map((template) => (
                <CardTemplate
                  key={template._id}
                  isForm={isForms}
                  template={template}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowTemplates;
