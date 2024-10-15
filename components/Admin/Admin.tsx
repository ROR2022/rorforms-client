"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CircularProgress } from "@nextui-org/progress";
import { TbReload } from "react-icons/tb";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "@nextui-org/button";

import { IDataWebSocket } from "../WebSocketClient";

import TableUsers from "./TableUsers";
import { TParsedDataUser } from "./TableUsers";

import { DataUser, RootState } from "@/redux/userSlice";
import {
  getAllUsers,
  deleteUser,
  changeStatusUser,
  assignRolesUser,
} from "@/api/apiUser";
import { WS_KEY } from "@/dataEnv/dataEnv";

const Admin = () => {
  const user: DataUser = useSelector((state: RootState) => state.user);
  const [dataUsers, setDataUsers] = useState<DataUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [usersOnline] = useLocalStorage<any>("usersOnline", []);
  const [, setDataWebSocket] = useLocalStorage<IDataWebSocket | null>(
    WS_KEY,
    null
  );

  useEffect(() => {
    //eslint-disable-next-line
    //console.log("user:..", user);
    if (user.access_token) {
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    //eslint-disable-next-line
    //console.log("Admin usersOnline:..", usersOnline);
    handleUsersOnline();
  }, [usersOnline]);

  useEffect(() => {}, [dataUsers]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers(user.access_token);
      //eslint-disable-next-line
      //console.log("getAllUsers response:..", response);
      const { data } = response;

      setLoading(false);
      if (data) {
        setDataUsers([...data]);
      }
    } catch (error) {
      //eslint-disable-next-line
      console.log("getAllUsers error:..", error);
      setLoading(false);
    }
  };

  const handleUsersOnline = () => {
    //eslint-disable-next-line
    console.log("Admin handleUsersOnline:..", usersOnline);
    const tempDataUsers = dataUsers.map((user) => {
      const tempUser = user;
      const tempOnline = usersOnline.find(
        (userOnline: any) => userOnline.userId === user._id
      );

      if (tempOnline) {
        tempUser.online = true;
      } else {
        tempUser.online = false;
      }

      return tempUser;
    });

    setDataUsers([...tempDataUsers]);
  };

  const handleBlockUser = async (userToUpdate: TParsedDataUser) => {
    //eslint-disable-next-line
    console.log("handleBlockUser user:..", userToUpdate);
    const { id, status } = userToUpdate;
    const { access_token } = user;
    const tempStatus = status === "active" ? "inactive" : "active";

    try {
      setLoading(true);
      const response = await changeStatusUser(id, tempStatus, access_token);
      //eslint-disable-next-line
      console.log("changeStatusUser response:..", response.data);
      const { data } = response;

      if (data?._id) {
        //alert("User status changed successfully");
        if (tempStatus === "inactive") {
          const tempDataWebSocket = { event: "logout", data: userToUpdate };
          //eslint-disable-next-line
          console.log("Admin tempDataWebSocket:..", tempDataWebSocket);

          setDataWebSocket({ data: JSON.stringify(tempDataWebSocket) });
        }
      }
      fetchUsers();
      setLoading(false);
    } catch (error) {
      //eslint-disable-next-line
      console.log("changeStatusUser error:..", error);
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userToUpdate: TParsedDataUser) => {
    //eslint-disable-next-line
    console.log("handleDeleteUser user:..", userToUpdate);
    const { id } = userToUpdate;
    const { access_token } = user;

    try {
      setLoading(true);
      const response = await deleteUser(id, access_token);
      //eslint-disable-next-line
      console.log("deleteUser response:..", response.data);
      const { data } = response;

      if (data?._id) {
        //alert("User deleted successfully");
        //force logout user
        const tempDataWebSocket = { event: "logout", data: userToUpdate };
        //eslint-disable-next-line
        console.log("Admin tempDataWebSocket:..", tempDataWebSocket);

        setDataWebSocket({ data: JSON.stringify(tempDataWebSocket) });
      }

      fetchUsers();
      setLoading(false);
    } catch (error) {
      //eslint-disable-next-line
      console.log("deleteUser error:..", error);
      setLoading(false);
    }
  };

  const handleToggleAdminUser = async (userToUpdate: TParsedDataUser) => {
    //eslint-disable-next-line
    console.log("handleToggleAdminUser user:..", userToUpdate);
    const { id, role } = userToUpdate;
    const { access_token } = user;
    const tempRoles = role.split(", ");

    //let isDisabledAdmin = false;

    if (tempRoles.includes("admin")) {
      const index = tempRoles.indexOf("admin");

      //isDisabledAdmin = true;

      tempRoles.splice(index, 1);
    } else {
      tempRoles.push("admin");
    }

    try {
      setLoading(true);
      const response = await assignRolesUser(id, tempRoles, access_token);
      //eslint-disable-next-line
      console.log("assignRolesUser response:..", response.data);
      const { data } = response;

      if (data?._id) {
        const tempDataWebSocket = { event: "logout", data: userToUpdate };

        setDataWebSocket({ data: JSON.stringify(tempDataWebSocket) });
      }

      fetchUsers();
      setLoading(false);
    } catch (error) {
      //eslint-disable-next-line
      console.log("assignRolesUser error:..", error);
      setLoading(false);
    }
  };

  return (
    <div>
      {(dataUsers.length === 0 || loading) && (
        <div className="flex justify-center items-center h-64 bg-slate-400">
          <CircularProgress aria-label="Loading..." />
        </div>
      )}
      {dataUsers.length > 0 && (
        <div>
          <div className="flex justify-end">
            <Button
              className="cursor-pointer text-2xl mb-2"
              color="secondary"
              variant="light"
              onClick={fetchUsers}
            >
              <TbReload />
            </Button>
          </div>
          <TableUsers
            dataUsers={dataUsers}
            handleBlockUser={handleBlockUser}
            handleDeleteUser={handleDeleteUser}
            handleToggleAdminUser={handleToggleAdminUser}
          />
        </div>
      )}
    </div>
  );
};

export default Admin;
