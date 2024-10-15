"use client";
import React, { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Link } from "@nextui-org/link";

import { LOCALSTORAGE_KEY } from "@/dataEnv/dataEnv";
import { initialState } from "@/redux/userSlice";
import BasicForm from "@/components/FormTemplate/BasicForm";

const PrePageCreate = () => {
  const [storedDataUser] = useLocalStorage(LOCALSTORAGE_KEY, initialState);

  useEffect(() => {
    if (!storedDataUser.access_token) {
      //window.location.href = "/login";
    }
    //console.log("storedDataUser", storedDataUser);
  }, [storedDataUser]);

  if (!storedDataUser.access_token) {
    return (
      <div className="flex justify-center items-center gap-2">
        <p>Please </p>
        <Link href="/login">Login</Link>
        <p> to continue</p>
      </div>
    );
  } else {
    return (
      <div>
        {" "}
        <BasicForm />{" "}
      </div>
    );
  }
};

export default PrePageCreate;
