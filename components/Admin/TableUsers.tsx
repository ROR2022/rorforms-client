"use client";
import React, { FC, use, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/progress";
import { TbLockCheck } from "react-icons/tb";
import { TbLockCancel } from "react-icons/tb";
import { GrUserAdmin } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { HiStatusOffline } from "react-icons/hi";

//import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
//import { EyeIcon } from "./EyeIcon";
import { columns } from "./data";

import { DataUser } from "@/redux/userSlice";
//import { parse } from "path";

/* const statusColorMap = {
  active: "success",
  inactive: "danger",
  vacation: "warning",
}; */

export interface TParsedDataUser {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  status: string;
  online: boolean;
  avatar: string;
  [key: string]: string | boolean;
}

/* type TColumnKey = {
  name: string;
  uid: string;
}; */

interface TableUsersProps {
  dataUsers: DataUser[];
  handleBlockUser: (user: TParsedDataUser) => void;
  handleDeleteUser: (user: TParsedDataUser) => void;
  handleToggleAdminUser: (user: TParsedDataUser) => void;
  usersOnline: any;
}

const TableUsers: FC<TableUsersProps> = ({
  dataUsers,
  handleBlockUser,
  handleDeleteUser,
  handleToggleAdminUser,
  usersOnline,
}) => {
  const [parsedDataUsers, setParsedDataUsers] = React.useState<
    TParsedDataUser[]
  >([]);

  useEffect(() => {
    //eslint-disable-next-line
    //console.log("TableUsers dataUsers:..", dataUsers);
    if (dataUsers.length > 0) {
      parseDataUsers();
    }
  }, [dataUsers]);

  useEffect(() => {
    //eslint-disable-next-line
    //console.log("TableUsers usersOnline:..", usersOnline);
    compareUsersOnline();
  }, [usersOnline]);

  useEffect(() => {}, [parsedDataUsers]);

  const parseDataUsers = () => {
    let tempUsers: TParsedDataUser[] = [];

    dataUsers.map((user) => {
      //eslint-disable-next-line
      //console.log("user:..", user);
      const { _id, name, email, roles, status, imageUrl } = user;

      const isUserOnline = usersOnline.find(
        (userOnline: any) => userOnline.userId === _id,
      );

      tempUsers.push({
        id: _id || "",
        name: name || "",
        email,
        role: roles?.join(", ") || "",
        team: "Team A",
        status: status || "",
        avatar: imageUrl || "",
        online: isUserOnline ? true : false,
      });
    });
    setParsedDataUsers([...tempUsers]);
  };

  const compareUsersOnline = () => {
    const actualUsersOnline = parsedDataUsers.filter((user) => user.online);
    const actualUsersOnlineIds = actualUsersOnline
      .map((user) => user.id)
      .join("");
    const newUsersOnlineIds = usersOnline
      .map((userOnline: any) => userOnline.userId)
      .join("");

    if (actualUsersOnlineIds !== newUsersOnlineIds) {
      parseDataUsers();
    }
  };

  const renderCell = React.useCallback(
    (user: TParsedDataUser, columnKey: string) => {
      const cellValue = user[columnKey];
      //eslint-disable-next-line
      //console.log("renderCell user role:..", user.role);
      const isAdminUser = user.role.includes("admin");

      switch (columnKey) {
        case "name":
          return (
            <User
              avatarProps={{ radius: "lg", src: user.avatar }}
              description={user.email}
              name={
                <div className="flex gap-2">
                  <h6>{user.name}</h6>
                  {user.online === true ? (
                    <HiOutlineStatusOnline className="text-success" />
                  ) : (
                    <HiStatusOffline className="text-danger" />
                  )}
                </div>
              }
            >
              {user.email}
            </User>
          );
        case "role":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{user.role}</p>
              <p className="text-bold text-sm capitalize text-default-400">
                {user.team}
              </p>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={
                user.status === "active"
                  ? "success"
                  : user.status === "inactive"
                    ? "danger"
                    : "warning"
              }
              size="sm"
              variant="flat"
            >
              {user.status}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Toggle Admin">
                <span className="text-lg text-secondary cursor-pointer active:opacity-50">
                  {isAdminUser ? (
                    <GrUserAdmin onClick={() => handleToggleAdminUser(user)} />
                  ) : (
                    <FaRegUser onClick={() => handleToggleAdminUser(user)} />
                  )}
                </span>
              </Tooltip>
              <Tooltip
                content={
                  user.status === "active" ? "Block user" : "Unblock user"
                }
              >
                <span className="text-lg text-warning cursor-pointer active:opacity-50">
                  {user.status === "active" ? (
                    <TbLockCancel onClick={() => handleBlockUser(user)} />
                  ) : (
                    <TbLockCheck onClick={() => handleBlockUser(user)} />
                  )}
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete user">
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <DeleteIcon onClick={() => handleDeleteUser(user)} />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  return (
    <>
      {parsedDataUsers.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <CircularProgress aria-label="Loading..." />
        </div>
      )}
      {parsedDataUsers.length > 0 && (
        <Table aria-label="Example table with custom cells">
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
          <TableBody items={parsedDataUsers}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, String(columnKey))}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default TableUsers;
