import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { FC, useEffect } from "react";

import { ILikeDto } from "./BottomCardTemplate";
import CardLike from "./CardLike";

interface ILikesModal {
  dataLikes: ILikeDto[];
  setShowLikesModal: (value: boolean) => void;
}

const LikesModal: FC<ILikesModal> = ({ dataLikes, setShowLikesModal }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    onOpen();
    console.log("Modal dataLikes:", dataLikes);
  }, []);

  const handleClose = () => {
    setShowLikesModal(false);
    onOpenChange();
  };

  return (
    <div>
      <Modal isOpen={isOpen} onOpenChange={handleClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Likes</ModalHeader>
              <ModalBody>
                {dataLikes.map((like) => (
                  <CardLike key={like._id} dataLike={like} />
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default LikesModal;
