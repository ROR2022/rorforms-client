"use client";
import React, { FC, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { CiViewTable } from "react-icons/ci";
import { IoGridOutline } from "react-icons/io5";
import { Button } from "@nextui-org/button";
import { Pagination, Select, SelectItem } from "@nextui-org/react";

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

interface IDataPagination {
  page: string;
  limit: string;
  totalPages: string;
  totalDocs: string;
}

const itemsPerPage = [
  { label: "10", key: "10" },
  { label: "20", key: "20" },
  { label: "30", key: "30" },
];

const initDataPagination = {
  page: "1",
  limit: "10",
  totalPages: "0",
  totalDocs: "0",
};

const ShowTemplates: FC<IShowTemplates> = ({ isForms }) => {
  const [templates, setTemplates] = useState<IBasicForm[]>([]);
  const [modeShowTemplates, setModeShowTemplates] = useState<boolean>(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [resetDataFilter, setResetDataFilter] = useState<boolean>(false);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [dataPagination, setDataPagination] =
    useState<IDataPagination>(initDataPagination);
  const [storedDataUser] = useLocalStorage(LOCALSTORAGE_KEY, initialState);

  useEffect(() => {
    fetchTemplates("1", "10");
  }, []);

  useEffect(() => {}, [dataPagination]);

  useEffect(() => {
    if (storedDataUser && storedDataUser.language) {
      setSelectedLanguage(storedDataUser.language);
    }
  }, [storedDataUser]);

  const fetchTemplates = async (page: string, limit: string) => {
    setIsFiltering(false);
    try {
      const response = isForms
        ? await getAllForms(page, limit)
        : await getAllTemplates(page, limit);
      //console.log("response:", response);
      //return;

      if (!response || !response.data) return;

      setDataPagination({
        page: String(response.data.page),
        limit: String(response.data.limit),
        totalPages: String(response.data.totalPages),
        totalDocs: String(response.data.totalDocs),
      });
      const tempTemplates = [...response.data.docs];
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
    } catch (error) {
      //eslint-disable-next-line
      console.error("Error fetching templates:", error);
    }
  };

  const handleSetDataFilter = async (filter: IFilter) => {
    //eslint-disable-next-line
    //console.log("Filter:", filter);
    //check if filter is empty
    if (
      filter.top.key === "" &&
      filter.category.key === "" &&
      filter.owner.key === "" &&
      filter.search === ""
    ) {
      setIsFiltering(false);

      return;
    }

    setIsFiltering(true);

    try {
      const tempDataFilter = {
        ...filter,
        userId: storedDataUser._id || "",
        isForms: isForms,
      };
      const resultFilter = await getTemplateByFilter(tempDataFilter);
      //eslint-disable-next-line
      //console.log("Result Filter:", resultFilter);
      const { data } = resultFilter;

      if (data) {
        /* setDataPagination({
          page: String(data.page),
          limit: String(data.limit),
          totalPages: String(data.totalPages),
          totalDocs: String(data.totalDocs),
        }); */
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

  const handleChangePage = (page: string) => {
    //eslint-disable-next-line
    //console.log("Change Page:", page);
    setDataPagination({ ...dataPagination, page });
    fetchTemplates(page, dataPagination.limit);
    setResetDataFilter(true);
    setIsFiltering(false);
    setTimeout(() => {
      setResetDataFilter(false);
    }, 1000);
  };

  const handleChangeItemsPerPage = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLimit = e.target.value;
    //eslint-disable-next-line
    //console.log("Change Limit:", newLimit);

    setDataPagination({ ...dataPagination, limit: newLimit });
    fetchTemplates(dataPagination.page, newLimit);
    setResetDataFilter(true);
    setIsFiltering(false);
    setTimeout(() => {
      setResetDataFilter(false);
    }, 1000);
  };

  return (
    <div>
      <FilterTemplates
        fetchTemplates={fetchTemplates}
        handleSetDataFilter={handleSetDataFilter}
        resetDataFilter={resetDataFilter}
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
        <div style={{ width: "100vw" }}>
          <div
            className="flex flex-wrap gap-2 justify-center items-center my-2"
            style={{ width: "90vw" }}
          >
            {isFiltering && (
              <div className="flex">
                <p className="text-small text-gray-600">
                  {isForms
                    ? selectedLanguage === "en"
                      ? "Filtered Forms: "
                      : "Filtro de Formularios: "
                    : selectedLanguage === "en"
                      ? "Filtered Templates: "
                      : "Filtro de Plantillas: "}{" "}
                </p>
                <p className="text-small text-gray-600"> {templates.length}</p>
              </div>
            )}
            {!isFiltering && (
              <div className="flex">
                <p className="text-small text-gray-600">
                  {isForms
                    ? selectedLanguage === "en"
                      ? "Total Forms: "
                      : "Total de Formularios: "
                    : selectedLanguage === "en"
                      ? "Total Templates: "
                      : "Total de Plantillas: "}{" "}
                </p>
                <p className="text-small text-gray-600">
                  {" "}
                  {dataPagination.totalDocs}
                </p>
              </div>
            )}

            <div>
              <Button onClick={() => setModeShowTemplates((prev) => !prev)}>
                {modeShowTemplates ? <CiViewTable /> : <IoGridOutline />}
              </Button>
            </div>
            {!isFiltering && (
              <>
                <div>
                  <Pagination
                    isCompact
                    showControls
                    initialPage={Number(dataPagination.page)}
                    total={Number(dataPagination.totalPages)}
                    onChange={(page) => handleChangePage(String(page))}
                  />
                </div>
                <div>
                  <Select
                    items={itemsPerPage}
                    label={`Max Items:`}
                    selectedKeys={[dataPagination.limit]}
                    style={{ width: "130px" }}
                    onChange={(e) => handleChangeItemsPerPage(e)}
                  >
                    {(item) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    )}
                  </Select>
                </div>
              </>
            )}
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
