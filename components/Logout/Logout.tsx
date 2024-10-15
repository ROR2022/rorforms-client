"use client";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody } from "@nextui-org/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import { DataUser, initialState, RootState, setUser } from "@/redux/userSlice";
import { LOCALSTORAGE_KEY, COOKIE_KEY } from "@/dataEnv/dataEnv";

const Logout = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const [storedDataUser, setStoredDataUser] = useLocalStorage<DataUser>(
    LOCALSTORAGE_KEY,
    user,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!storedDataUser.access_token) {
      //eslint-disable-next-line
      console.log("successfully logged out");
    }
  }, [storedDataUser]);

  const handleLogOut = () => {
    dispatch(setUser(initialState));
    setStoredDataUser(initialState);
    Cookies.remove(COOKIE_KEY);
    router.push("/");
  };

  return (
    <Card style={{ width: "300px", maxWidth: "600px", margin: "auto" }}>
      <CardBody>
        <p className="text-violet-700 mb-4">Are you sure you want to logout?</p>
        <Button color="danger" onClick={handleLogOut}>
          Logout
        </Button>
      </CardBody>
    </Card>
  );
};

export default Logout;
