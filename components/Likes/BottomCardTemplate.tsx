import React, { FC, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { FaRegFaceSadTear } from "react-icons/fa6";
import { FaRegSmileWink } from "react-icons/fa";
import { FaRegFaceGrinSquintTears } from "react-icons/fa6";
import { FaRegFaceGrinHearts } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";
import { FaRegCommentDots } from "react-icons/fa";
import { Card, CardFooter } from "@nextui-org/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";

import { IBasicForm } from "../FormTemplate/BasicForm";

import LikesModal from "./LikesModal";
import CommentsModal from "./CommentsModal";
import { LikeType } from "./CardLike";

import { LOCALSTORAGE_KEY } from "@/dataEnv/dataEnv";
import { initialState } from "@/redux/userSlice";
import {
  getLikesForTemplate,
  getCommentsForTemplate,
  postLike,
  deleteLike,
  updateLike,
} from "@/api/apiLikes";

export interface ILikeDto {
  _id?: string;
  userId: string;
  templateId: string;
  like: boolean;
  type: LikeType;
  createdAt?: Date;
}

export interface IComentDto {
  _id?: string;
  userId: string;
  templateId: string;
  coment: string;
  type: string;
  createdAt?: Date;
}

interface IBottomCardTemplate {
  template: IBasicForm;
}

const BottomCardTemplate: FC<IBottomCardTemplate> = ({ template }) => {
  const [dataLikes, setDataLikes] = useState<ILikeDto[]>([]);
  const [dataComents, setDataComents] = useState<IComentDto[]>([]);
  const [myLike, setMyLike] = useState<ILikeDto | null>(null);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [errorLogin, setErrorLogin] = useState<string>("");
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [storedDataUser] = useLocalStorage(LOCALSTORAGE_KEY, initialState);
  const { access_token, _id } = storedDataUser;
  const [isOpenLike, setIsOpenLike] = useState(false);
  const [reloadTemplateId, setReloadTemplateId] = useLocalStorage<string>(
    "reloadTemplateId",
    ""
  );
  const [, setUpdatedTemplateId] = useLocalStorage<string>(
    "updatedTemplateId",
    ""
  );

  useEffect(() => {
    if (reloadTemplateId === template._id) {
      fetchData();
      setReloadTemplateId("");
    }
  }, [reloadTemplateId]);

  useEffect(() => {
    //console.log("template:", template);
    if (template && template._id) {
      fetchData();
    } else {
      //eslint-disable-next-line
      console.error("No template._id");
    }
  }, [template]);

  useEffect(() => {
    //console.log("dataLikes:", dataLikes);
  }, [dataLikes]);

  useEffect(() => {
    //console.log("dataComents:", dataComents);
  }, [dataComents]);

  useEffect(() => {
    //console.log("myLike:", myLike);
  }, [myLike]);

  const fetchData = async () => {
    try {
      const resultLikes = await getLikesForTemplate(template._id);
      const resultComents = await getCommentsForTemplate(template._id);
      //eslint-disable-next-line
      //console.log("BottomCardTemplates resultLikes:", resultLikes);

      if (resultLikes && resultLikes.data) {
        const tempLikes: ILikeDto[] = [...resultLikes.data];
        const myLikeTemp = tempLikes.find((like) => like.userId === _id);

        if (myLikeTemp) {
          setMyLike(myLikeTemp);
        }

        setDataLikes([...tempLikes]);
      }
      //eslint-disable-next-line
      //console.log("BottomCardTemplates resultComents:", resultComents);

      if (resultComents && resultComents.data) {
        setDataComents([...resultComents.data]);
      }
    } catch (error) {
      //eslint-disable-next-line
      console.error("Error fetchData:", error);
    }
  };

  const handleLike = async (typeLike: LikeType) => {
    //console.log("handleLike", typeLike);
    setIsOpenLike(false);
    try {
      if (!access_token || !_id || !template._id) {
        //eslint-disable-next-line
        console.error("No access token or _id or template._id");
        setErrorLogin("You need to login to like");

        setTimeout(() => {
          setErrorLogin("");
        }, 2000);

        return;
      }
      const tempDataLike: ILikeDto = {
        userId: _id,
        templateId: template._id,
        like: true,
        type: typeLike,
      };

      if (myLike === null) {
        //this is a create new like
        const resCreateLike = await postLike(tempDataLike, access_token);
        //eslint-disable-next-line
        console.log("resCreateLike:", resCreateLike);
        const { data } = resCreateLike;

        if (data) {
          setDataLikes([...dataLikes, data]);
          setMyLike({ ...data });
          //emit event to reload fetch data
          setUpdatedTemplateId(template._id);
        }
      } else {
        if (typeLike === "remove") {
          //this is a delete like
          const resDeleteLike = await deleteLike(myLike._id, access_token);
          //eslint-disable-next-line
          console.log("resDeleteLike:", resDeleteLike);
          const { data } = resDeleteLike;

          if (data) {
            const newLikesTmp = dataLikes.filter(
              (like) => like._id !== myLike._id
            );

            setDataLikes([...newLikesTmp]);
            setMyLike(null);
            //emit event to reload fetch data
            setUpdatedTemplateId(template._id);
          }
        } else {
          //this is a update like
          //const {}=tempDataLike;
          const resUpdateLike = await updateLike(
            myLike._id,
            tempDataLike,
            access_token
          );
          //eslint-disable-next-line
          console.log("resUpdateLike:", resUpdateLike);
          const { data } = resUpdateLike;

          if (data) {
            //emit event to reload fetch data
            setUpdatedTemplateId(template._id);
            setDataLikes((prevLikes) => {
              const newLikesTmp = prevLikes.map((like) =>
                String(like._id) === String(myLike._id)
                  ? { ...data }
                  : { ...like }
              );

              return [...newLikesTmp];
            });
            //eslint-disable-next-line
            setMyLike((prevLike) => {
              return { ...data };
            });
          }
        }
      }
    } catch (error) {
      //eslint-disable-next-line
      console.error("Error handleLike:", error);
      setErrorLogin("Error creating like");

      setTimeout(() => {
        setErrorLogin("");
      }, 2000);
    }
  };

  const handleComment = () => {
    //console.log("handleComment");
    setShowCommentsModal(true);
  };

  const getLikeIcon = (type: string) => {
    switch (type) {
      case "love":
        return <FcLike className="text-xl text-red-600 cursor-pointer" />;
      case "smile":
        return (
          <FaRegSmileWink className="text-xl text-green-600 cursor-pointer" />
        );
      case "care":
        return (
          <FaRegFaceGrinHearts className="text-xl text-pink-600 cursor-pointer" />
        );
      case "laugh":
        return (
          <FaRegFaceGrinSquintTears className="text-xl text-yellow-400 cursor-pointer" />
        );
      case "sad":
        return (
          <FaRegFaceSadTear className="text-xl text-cyan-600 cursor-pointer" />
        );
      default:
        return <BiLike className="text-xl text-indigo-600 cursor-pointer" />;
    }
  };

  const handleShowLikesModal = () => {
    //console.log("handleShowLikesModal");
    setShowLikesModal(true);
  };

  return (
    <div>
      {showLikesModal && (
        <LikesModal
          dataLikes={dataLikes}
          setShowLikesModal={setShowLikesModal}
        />
      )}
      {showCommentsModal && (
        <CommentsModal
          dataComents={dataComents}
          fetchData={fetchData}
          setShowCommentsModal={setShowCommentsModal}
          templateId={template?._id || ""}
        />
      )}
      <Card>
        <CardFooter>
          <div className="flex justify-between" style={{ width: "100%" }}>
            <div className="flex gap-2 items-center">
              <button
                className="text-small text-slate-300"
                onClick={handleShowLikesModal}
              >
                {dataLikes.length}
              </button>
              <Popover
                color="default"
                isOpen={isOpenLike}
                placement="top"
                onOpenChange={(open) => setIsOpenLike(open)}
              >
                <PopoverTrigger>
                  <Button color="secondary" size="sm" variant="flat">
                    {myLike ? (
                      getLikeIcon(myLike.type)
                    ) : (
                      <BiLike className="text-xl text-indigo-600" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex gap-2 items-center">
                    <FcLike
                      className="text-xl cursor-pointer"
                      onClick={() => handleLike("love")}
                    />
                    <FaRegSmileWink
                      className="text-xl text-green-600 cursor-pointer"
                      onClick={() => handleLike("smile")}
                    />
                    <FaRegFaceGrinHearts
                      className="text-xl text-pink-600 cursor-pointer"
                      onClick={() => handleLike("care")}
                    />
                    <FaRegFaceGrinSquintTears
                      className="text-xl text-yellow-400 cursor-pointer"
                      onClick={() => handleLike("laugh")}
                    />
                    <FaRegFaceSadTear
                      className="text-xl text-cyan-600 cursor-pointer"
                      onClick={() => handleLike("sad")}
                    />
                    <BiDislike
                      className="text-xl text-slate-600 cursor-pointer"
                      onClick={() => handleLike("remove")}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <button onClick={handleComment}>
              <div className="flex gap-2 items-center">
                <span className="text-small text-slate-300">
                  {dataComents.length}
                </span>
                <div
                  className="bg-stone-600 rounded "
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "50px",
                    height: "30px",
                  }}
                >
                  <FaRegCommentDots className="text-xl text-primary" />
                </div>
              </div>
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {errorLogin && (
              <div className="text-red-500 text-sm">{errorLogin}</div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BottomCardTemplate;
