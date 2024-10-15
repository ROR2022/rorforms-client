import React, { FC, useEffect, useState } from "react";
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
  const isFormMenu = (
    <DropdownMenu aria-label="Static Actions">
      <DropdownItem key="fill" textValue="fill" onPress={onSolve}>
        <div className="px-1 py-2">
          <div className="text-small font-bold flex justify-start items-center gap-2">
            <SiReacthookform className="text-success text-2xl font-extrabold" />{" "}
            <p className="text-success">Fill</p>
          </div>
        </div>
      </DropdownItem>
    </DropdownMenu>
  );

  const isTemplateMenu = (
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
  );

  const [myMenu, setMyMenu] = useState<JSX.Element | null>(isTemplateMenu);

  useEffect(() => {
    console.log("MenuCardOptions isForm:", isForm);
    if (isForm) {
      setMyMenu(isFormMenu);
    } else {
      setMyMenu(isTemplateMenu);
    }
  }, []);

  //console.log("MenuCardOptions isForm:", isForm);

  return (
    <>
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
        {myMenu}
      </Dropdown>
    </>
  );
};

export default MenuCardOptions;
