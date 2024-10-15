"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "@nextui-org/button";
import { CircularProgress } from "@nextui-org/react";
import { CiViewTable } from "react-icons/ci";
import { IoGridOutline } from "react-icons/io5";

import { IBasicForm } from "../FormTemplate/BasicForm";
import CardTemplate from "../TemplatesNavigation/CardTemplate";
import TableTemplates from "../TemplatesNavigation/TableTemplates";

import { LOCALSTORAGE_KEY } from "@/dataEnv/dataEnv";
import { initialState } from "@/redux/userSlice";
import { getTemplatesbySearch } from "@/api/apiForm";

const MainSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const myMainSearch = searchParams.get("mainSearch");
  const [templates, setTemplates] = useState<IBasicForm[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modeShowTemplates, setModeShowTemplates] = useState<boolean>(true);
  //const [isfFilter, setIsFilter] = useState<boolean>(false);
  const [storedDataUser] = useLocalStorage(LOCALSTORAGE_KEY, initialState);

  useEffect(() => {
    //console.log("searchParams:", searchParams);
    //console.log("myMainSearch:", myMainSearch);
    if (myMainSearch) {
      fetchTemplatesBySearch(myMainSearch);
    } else {
      router.push("/");
    }
  }, [myMainSearch]);

  const fetchTemplatesBySearch = async (search: string) => {
    try {
      setLoading(true);
      const result = await getTemplatesbySearch(search);
      const tempTemplates = [...result.data];
      //eslint-disable-next-line
      console.log("result tempTemplates:", tempTemplates);
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
      setLoading(false);
    } catch (error) {
      //eslint-disable-next-line
      console.log("error:", error);
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <h3 className="flex justify-center text-3xl text-slate-500">
          Search Result
        </h3>
        {loading && (
          <div className="flex justify-center my-3">
            <CircularProgress aria-label="Loading..." />
          </div>
        )}
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
                Templates: {templates.length}
              </p>
              <Button onClick={() => setModeShowTemplates((prev) => !prev)}>
                {modeShowTemplates ? <CiViewTable /> : <IoGridOutline />}
              </Button>
            </div>
            {modeShowTemplates === true && (
              <TableTemplates templates={templates} />
            )}

            {modeShowTemplates === false && (
              <div className="flex flex-wrap justify-center items-center gap-2 my-4 pt-2">
                {templates.map((template) => (
                  <CardTemplate key={template._id} template={template} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default MainSearch;
