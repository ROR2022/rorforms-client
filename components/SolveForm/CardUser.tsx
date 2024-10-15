import React, { FC } from "react";
import { User } from "@nextui-org/react";

interface ICardUser {
  imageUrl: string;
  description: string;
  name: string;
}

const CardUser: FC<ICardUser> = ({ imageUrl, description, name }) => {
  return (
    <User
      avatarProps={{
        src: imageUrl || "/questionIcon.png",
        style: { width: "20vw", height: "auto" },
      }}
      description={<p className="text-xl">{description || "No Description"}</p>}
      name={<h1 className="text-2xl font-bold">{name || "No Title"}</h1>}
    />
  );
};

export default CardUser;
