import { Card, CardBody, User } from "@nextui-org/react";
import React, { FC, useEffect, useState } from "react";
import { FaRegFaceSadTear } from "react-icons/fa6";
import { FaRegSmileWink } from "react-icons/fa";
import { FaRegFaceGrinSquintTears } from "react-icons/fa6";
import { FaRegFaceGrinHearts } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";

import { ILikeDto } from "./BottomCardTemplate";

import { findUserById } from "@/api/apiUser";
import { DataUser } from "@/redux/userSlice";

interface ICardLike {
  dataLike: ILikeDto;
}

export type LikeType =
  | "love"
  | "sad"
  | "care"
  | "laugh"
  | "smile"
  | "none"
  | "remove";

const objIcons: Record<LikeType, JSX.Element> = {
  love: <FcLike className="text-xl text-red-600 cursor-pointer" />,
  sad: <FaRegFaceSadTear className="text-xl text-cyan-600 cursor-pointer" />,
  care: (
    <FaRegFaceGrinHearts className="text-xl text-pink-600 cursor-pointer" />
  ),
  laugh: (
    <FaRegFaceGrinSquintTears className="text-xl text-yellow-400 cursor-pointer" />
  ),
  smile: <FaRegSmileWink className="text-xl text-green-600 cursor-pointer" />,
  none: <FcLike className="text-xl text-indigo-600 cursor-pointer" />,
  remove: <FcLike className="text-xl text-gray-600 cursor-pointer" />,
};

const CardLike: FC<ICardLike> = ({ dataLike }) => {
  const [dataUser, setDataUser] = useState<DataUser>();

  useEffect(() => {
    if (dataLike.userId) {
      fetchDataUser();
    } else {
      //eslint-disable-next-line
      console.log("no user id");
    }
  }, []);

  const fetchDataUser = async () => {
    try {
      const userTmp = await findUserById(dataLike.userId);
      //eslint-disable-next-line
      console.log(userTmp);
      if (userTmp && userTmp.data) {
        setDataUser(userTmp.data);
      }
    } catch (error) {
      //eslint-disable-next-line
      console.error("Error fetchDataUser:", error);
    }
  };

  return (
    <div>
      <Card>
        <CardBody>
          <div className="flex justify-between items-center gap-1">
            <User
              avatarProps={{
                src: dataUser?.imageUrl || "",
              }}
              description={dataUser?.email || ""}
              name={dataUser?.name || ""}
            />
            <div>{objIcons[dataLike.type]}</div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CardLike;
