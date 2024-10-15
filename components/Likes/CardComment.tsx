import { findUserById } from "@/api/apiUser";
import { Card, CardBody, CardHeader, User } from "@nextui-org/react";
import React, { FC, useEffect, useState } from "react";
import { IComentDto } from "./BottomCardTemplate";
import { DataUser } from "@/redux/userSlice";

interface ICardComment {
  dataComment: IComentDto;
}

const CardComment: FC<ICardComment> = ({ dataComment }) => {
  const [dataUser, setDataUser] = useState<DataUser>();

  useEffect(() => {
    if (dataComment.userId) {
      fetchDataUser();
    } else {
      //eslint-disable-next-line
      console.log("no user id");
    }
  }, []);

  const fetchDataUser = async () => {
    try {
      const userTmp = await findUserById(dataComment.userId);
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
        <CardHeader>
          <div className="flex justify-start items-center gap-1">
            <User
              avatarProps={{
                src: dataUser?.imageUrl || "",
              }}
              description={dataUser?.email || ""}
              name={dataUser?.name || ""}
            />
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-slate-500 small">{dataComment.coment}</p>
        </CardBody>
      </Card>
    </div>
  );
};

export default CardComment;
