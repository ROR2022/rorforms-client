"use client";
import React, { useEffect } from "react";
import { Image, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { useMediaQuery } from "react-responsive";

//import WebSocketClient from "../WebSocketClient";

import ShowTemplates from "./ShowTemplates";

import { LOCALSTORAGE_KEY } from "@/dataEnv/dataEnv";
import { initialState } from "@/redux/userSlice";

const TemplatesNavigation = () => {
  const [storedDataUser] = useLocalStorage(LOCALSTORAGE_KEY, initialState);
  const isMobile = useMediaQuery({ query: "(max-width: 500px)" });
  const { language } = storedDataUser;
  const router = useRouter();

  useEffect(() => {}, [storedDataUser]);

  useEffect(() => {}, [isMobile]);

  const handleNewTemplate = () => {
    //eslint-disable-next-line
    console.log("New Template");
    router.push("/create-template");
  };

  return (
    <div>
      
      <Tooltip
        content={
          language === "es" ? "Crear nueva platilla" : "Create new template"
        }
        placement="right"
      >
        <button
          className="border-2 border-solid border-purple-700 rounded-2xl flex justify-center items-center"
          style={{
            width: isMobile ? "80vw" : "340px",
            paddingTop: "20px",
            paddingBottom: "20px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          onClick={handleNewTemplate}
        >
          <Image alt="addIcon" height="auto" src="/addIcon.png" width="280px" />
        </button>
      </Tooltip>
      <ShowTemplates />
    </div>
  );
};

export default TemplatesNavigation;
