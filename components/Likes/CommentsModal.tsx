import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { FC, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { BsSend } from "react-icons/bs";
//import { IoIosCloseCircleOutline } from "react-icons/io";

import { IComentDto } from "./BottomCardTemplate";
import CardComment from "./CardComment";

import { postComment } from "@/api/apiLikes";
import { LOCALSTORAGE_KEY } from "@/dataEnv/dataEnv";
import { initialState } from "@/redux/userSlice";

interface ICommentsModal {
  dataComents: IComentDto[];
  setShowCommentsModal: (value: boolean) => void;
  templateId: string;
  fetchData: () => void;
}

const CommentsModal: FC<ICommentsModal> = ({
  dataComents,
  setShowCommentsModal,
  templateId,
  fetchData,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newComment, setNewComment] = useState<string>("");
  const [storedDataUser] = useLocalStorage(LOCALSTORAGE_KEY, initialState);
  const [, setUpdatedTemplateId] = useLocalStorage<string>(
    "updatedTemplateId",
    ""
  );

  const [internalDataComents, setInternalDataComents] = useState<IComentDto[]>([
    ...dataComents,
  ]);

  useEffect(() => {
    onOpen();
    console.log("Modal dataComents:", dataComents);

    if (dataComents.length > 0) {
      setInternalDataComents([...dataComents]);
    }
  }, []);

  useEffect(() => {
    setInternalDataComents([...dataComents]);
  }, [dataComents]);

  const onAction = async () => {
    if (!newComment) {
      //eslint-disable-next-line
      console.log("no comment");

      return;
    }
    //console.log("creating new coment:..", newComment);
    try {
      const { access_token, _id } = storedDataUser;

      if (!_id || !access_token) {
        //eslint-disable-next-line
        console.log("no user id or access token");

        return;
      }
      const newDataComment: IComentDto = {
        userId: _id,
        templateId: templateId,
        coment: newComment,
        type: "comment",
      };

      const resNewComment = await postComment(newDataComment, access_token);
      //eslint-disable-next-line
      console.log("resNewComment:", resNewComment);
      const { data } = resNewComment;

      if (data) {
        setInternalDataComents([...internalDataComents, { ...data }]);

        setNewComment("");
        //emit event to reload fetch data
        setUpdatedTemplateId(templateId);
      }
    } catch (error) {
      //eslint-disable-next-line
      console.log("error creating new coment:..", error);
    }
  };

  const handleClose = () => {
    setShowCommentsModal(false);
    onOpenChange();
  };

  return (
    <div>
      <Modal isOpen={isOpen} onOpenChange={handleClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Comentarios
              </ModalHeader>
              <ModalBody>
                {internalDataComents.map((comment) => (
                  <CardComment key={comment._id} dataComment={comment} />
                ))}
              </ModalBody>
              <ModalFooter>
                <div
                  className="flex justify-center items-center gap-1"
                  style={{ width: "100%" }}
                >
                  <Input
                    placeholder="Escribe un comentario"
                    size="md"
                    value={newComment}
                    width="100%"
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button
                    color="secondary"
                    size="sm"
                    variant="light"
                    onPress={onAction}
                  >
                    <BsSend className="text-xl" />
                  </Button>
                  {/* <Button
                  color="danger"
                  size="sm"
                  variant="light"
                  onPress={onClose}
                >
                  <IoIosCloseCircleOutline className="text-xl" />
                </Button> */}
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CommentsModal;
