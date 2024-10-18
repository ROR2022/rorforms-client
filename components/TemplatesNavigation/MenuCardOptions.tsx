import React, { FC, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { SiReacthookform } from "react-icons/si";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FaRegCopy } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { LOCALSTORAGE_KEY } from "@/dataEnv/dataEnv";
import { initialState } from "@/redux/userSlice";

//import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";

interface IMenuCardOptions {
  onEdit: () => void;
  onDelete: () => void;
  onSolve: () => void;
  onCopy: () => void;
  isForm?: boolean;
}

const MenuCardOptions: FC<IMenuCardOptions> = ({
  onSolve,
  onEdit,
  onDelete,
  onCopy,
  isForm,
}) => {
  //const [myMenu, setMyMenu] = useState<JSX.Element | null>(isTemplateMenu);
  const [storedDataUser] = useLocalStorage(LOCALSTORAGE_KEY, initialState);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);

  useEffect(() => {
    //console.log("MenuCardOptions isForm:", isForm);
    /* if (isForm === true) {
      setMyMenu(isFormMenu);
    } else {
      setMyMenu(isTemplateMenu);
    } */
  }, [isForm]);

  useEffect(() => {
    if (storedDataUser.roles && storedDataUser.roles.includes("admin")) {
      setIsAdminUser(true);
    } else {
      setIsAdminUser(false);
    }
  }, [storedDataUser]);

  //console.log("MenuCardOptions isForm:", isForm);

  if (isForm && isForm === true) {
    return (
      <Dropdown>
        <DropdownTrigger>
          <Button
            color="secondary"
            size="sm"
            style={{ width: "30px", marginLeft: "auto", marginRight: "5px" }}
            variant="light"
          >
            <FiMoreVertical />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="fill" textValue="fill" onPress={onSolve}>
            <div className="px-1 py-2">
              <div className="text-small font-bold flex justify-start items-center gap-2">
                <SiReacthookform className="text-success text-2xl font-extrabold" />{" "}
                <p className="text-success">Fill</p>
              </div>
            </div>
          </DropdownItem>

          <DropdownItem
            key="delete"
            textValue="delete"
            onPress={isAdminUser === true ? onDelete : undefined}
          >
            {isAdminUser === true ? (
              <div className="px-1 py-2">
                <div className="text-small font-bold flex justify-start items-center gap-2">
                  <MdOutlineDeleteForever className="text-danger text-2xl font-extrabold" />
                  <p className="text-danger">Delete</p>
                </div>
              </div>
            ) : (
              <p className="text-small text-slate-300">↩</p>
            )}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  } else {
    return (
      <Dropdown>
        <DropdownTrigger>
          <Button
            color="secondary"
            size="sm"
            style={{
              width: "30px",
              marginLeft: "auto",
              marginRight: "5px",
            }}
            variant="light"
          >
            <FiMoreVertical />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="copy" textValue="copy" onPress={onCopy}>
            <div className="px-1 py-2">
              <div className="text-small font-bold flex justify-start items-center gap-2">
                <FaRegCopy className="text-secondary text-2xl font-extrabold" />{" "}
                <p className="text-secondary">Copy</p>
              </div>
            </div>
          </DropdownItem>

          <DropdownItem key="edit" textValue="edit" onPress={onEdit}>
            <div className="px-1 py-2">
              <div className="text-small font-bold flex justify-start items-center gap-2">
                <CiEdit className="text-warning text-2xl font-extrabold" />
                <p className="text-warning">Edit</p>
              </div>
            </div>
          </DropdownItem>
          <DropdownItem key="delete" textValue="delete" onPress={onDelete}>
            <div className="px-1 py-2">
              <div className="text-small font-bold flex justify-start items-center gap-2">
                <MdOutlineDeleteForever className="text-danger text-2xl font-extrabold" />
                <p className="text-danger">Delete</p>
              </div>
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
};

export default MenuCardOptions;
