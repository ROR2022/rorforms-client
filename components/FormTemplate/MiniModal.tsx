import { useEffect, FC } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

const MiniModal: FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    //eslint-disable-next-line
    //console.log("Modal isOpen:", isOpen);
    onOpen();
    setTimeout(() => {
      onOpenChange();
    }, 500);
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Changes Succefully Updated
              </ModalHeader>
              <ModalBody>
                <p className="text-small text-gray-200">
                  This will close automatically.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default MiniModal;
