import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";
import {
  Autocomplete,
  AutocompleteItem,
  CircularProgress,
} from "@nextui-org/react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Tooltip, Image, Select, SelectItem } from "@nextui-org/react";
import React, { FC, useRef, useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { FaRegSquarePlus } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import { LuImagePlus } from "react-icons/lu";
import { useSelector } from "react-redux";

import { IBasicForm } from "./BasicForm";
//import { ISelectItem } from "./BasicQuestion";

import { uploadImage, getAllUsers } from "@/api/apiUser";
import { DataUser, initialState, RootState } from "@/redux/userSlice";
import { LOCALSTORAGE_KEY } from "@/dataEnv/dataEnv";
import { createForm } from "@/api/apiForm";

interface IHeaderForm {
  addNewQuestion: () => void;
  formValues: IBasicForm;
  updateFormValues: (form: IBasicForm) => void;
}

interface IUserLabel {
  key: string;
  label: string;
}

export const categories = [
  { key: "cat1", label: "Personal" },
  { key: "cat2", label: "Work" },
  { key: "cat3", label: "Education" },
];

const HeaderForm: FC<IHeaderForm> = ({
  addNewQuestion,
  formValues,
  updateFormValues,
}) => {
  const [formTitle, setFormTitle] = useState<string>("");
  const [isPublicForm, setIsPublicForm] = useState<boolean>(true);
  //const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userLabels, setUserLabels] = useState<IUserLabel[]>([]);
  const [isAddingColaborator, setIsAddingColaborator] =
    useState<boolean>(false);
  const [colaborators, setColaborators] = useState<IUserLabel[]>([]);
  const [changeColaborators, setChangeColaborators] = useState<boolean>(false);
  const [formDescription, setFormDescription] = useState<string>("");
  const [formCategory, setFormCategory] = useState<string>("");
  const [Loading, setLoading] = useState<boolean>(false);
  const [messageResCreateForm, setMessageResCreateForm] = useState<string>("");
  const [mainImage, setMainImage] = useState<string | File | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const user: DataUser = useSelector((state: RootState) => state.user);
  const [storedDataUser] = useLocalStorage(LOCALSTORAGE_KEY, initialState);
  const { language } = storedDataUser;

  useEffect(() => {
    //eslint-disable-next-line
    console.log("Form Values:", formValues);
    setFormTitle(formValues.title);
    setFormDescription(formValues.description);
    setFormCategory(formValues.category);
    setMainImage(formValues.imageUrl);
    setIsPublicForm(
      formValues.isPublic !== undefined ? formValues.isPublic : true
    );
    fetchUsers();
  }, [formValues]);

  useEffect(() => {
    if (
      userLabels.length > 0 &&
      formValues.usersGuest &&
      formValues.usersGuest.length > 0
    ) {
      const tempColaborators = formValues.usersGuest?.map((user) => {
        const findUser = userLabels.find((label) => label.key === user);

        return findUser;
      });

      setColaborators(tempColaborators as IUserLabel[]);
    }
  }, [userLabels]);

  useEffect(() => {}, [storedDataUser]);
  useEffect(() => {
    if (changeColaborators === true) {
      //eslint-disable-next-line
      console.log("Colaborators:", colaborators);

      updateFormValues({
        ...formValues,
        usersGuest: colaborators.map((user) => user.key),
      });
      setChangeColaborators(false);
    }
  }, [colaborators]);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers(user.access_token);
      //eslint-disable-next-line
      //console.log("Users:", response);
      const { data } = response;

      if (data) {
        const tempData = data.filter(
          (user: any) => user.email !== "roritransition2024@gmx.es"
        );
        const users = tempData.map((user: any) => {
          return {
            key: String(user._id),
            label: `${user.name} - ${user.email}`,
          };
        });

        setUserLabels(users);
      }
    } catch (error) {
      //eslint-disable-next-line
      console.log("Error fetching users:", error);
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    //eslint-disable-next-line
    //console.log("Add Main image:",e.target.files[0]);
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];

      if (file) {
        setMainImage(file);
        handleUploadImage(file);
      }
    }
  };

  const handleUploadImage = async (file: File) => {
    //eslint-disable-next-line
    console.log("Upload image:", file);
    if (!user.access_token) {
      //eslint-disable-next-line
      console.log("No access token");
      alert("No access token");

      return;
    }
    try {
      const tempFormData = new FormData();

      tempFormData.append("file", file);

      const response = await uploadImage(tempFormData, user.access_token);
      //eslint-disable-next-line
      console.log("Response:", response);
      const { data } = response;

      if (data) {
        updateFormValues({ ...formValues, imageUrl: data });
      }
    } catch (error) {
      //eslint-disable-next-line
      console.log("Error uploading image:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "title") setFormTitle(value);
    if (name === "description") setFormDescription(value);
    if (name === "category") setFormCategory(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      updateFormValues({ ...formValues, [name]: value });
    }, 1000);
  };

  const handleClearMainImage = () => {
    setMainImage(null);
    updateFormValues({ ...formValues, imageUrl: "" });
  };

  const handleChangeIsPublic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    //eslint-disable-next-line
    console.log("Is Public:", checked);
    setIsPublicForm(checked);
    //setFormValues({ ...formValues, isPublic: checked });

    updateFormValues({ ...formValues, isPublic: checked });
  };

  const handleSelectedUser = (selected: any) => {
    //eslint-disable-next-line
    console.log("Selected Users:..", selected);
    //console.log("userLabels:", userLabels);
    const findUser = userLabels.find(
      (user) => String(user.key) === String(selected)
    );

    if (findUser) {
      setColaborators((prevState) => {
        const newList = [...prevState, findUser];

        setChangeColaborators(true);

        return newList;
      });
      setIsAddingColaborator(false);
    } else {
      //eslint-disable-next-line
      console.log("User not found");
    }
  };

  const handleDeleteColaborator = (colaborator: IUserLabel) => {
    //eslint-disable-next-line
    console.log("Delete Colaborator", colaborator);
    const tempColaborators = colaborators.filter(
      (c) => c.key !== colaborator.key
    );

    setColaborators(tempColaborators);
    setChangeColaborators(true);
  };

  const handleMakeNewForm = async () => {
    //this function will be used to create a new form with the same values & with isForm = true
    //eslint-disable-next-line
    console.log("Make new form", formValues);
    const formId = formValues._id;
    const userToken = user.access_token;

    if (!formId || !userToken) {
      //eslint-disable-next-line
      console.error("No formId or userToken");

      return;
    }

    try {
      setLoading(true);
      const resCreateNewForm = await createForm(formId, userToken);
      //eslint-disable-next-line
      console.log("Response create new form:", resCreateNewForm);
      const { data } = resCreateNewForm;

      setLoading(false);
      if (data) {
        //eslint-disable-next-line
        console.log("New Form data:", data);
        const { template } = data;

        if (template) {
          //updateFormValues(template);
          setMessageResCreateForm(
            language === "es"
              ? "Formulario creado correctamente"
              : "Form created successfully",
          );

          setTimeout(() => {
            setMessageResCreateForm("");
          }, 2000);
        }
      }
    } catch (error) {
      //eslint-disable-next-line
      console.log("Error creating new form:", error);
      setLoading(false);
      setMessageResCreateForm(
        language === "es"
          ? "Error al crear el formulario"
          : "Error creating form",
      );
      setTimeout(() => {
        setMessageResCreateForm("");
      }, 2000);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        margin: "0 auto",
        marginBottom: "20px",
      }}
    >
      <div style={{ width: "100px", height: "50px", marginBottom: "10px" }}>
        <label
          aria-label={language === "es" ? "Agregar Imagen" : "Add image"}
          htmlFor="fileMainImage"
        >
          <Tooltip content={language === "es" ? "Agregar Imagen" : "Add image"}>
            <div
              className="cursor-pointer my-2 border-2 border-solid rounded-2xl border-indigo-600 flex justify-center items-center text-indigo-600"
              style={{ width: "100px", height: "50px" }}
            >
              <LuImagePlus />
            </div>
          </Tooltip>
        </label>
        <input
          accept="image/*"
          id="fileMainImage"
          style={{
            display: "none",
            width: "100px",
            height: "50px",
            position: "absolute",
            top: "0px",
            left: "0px",
          }}
          type="file"
          onChange={handleImage}
        />
      </div>
      {mainImage && (
        <div className="flex justify-center items-center gap-3">
          <Image
            alt="Main image"
            className="mb-2"
            src={
              typeof mainImage === "string"
                ? mainImage
                : URL.createObjectURL(mainImage as File)
            }
            width="200px"
          />
          <FaTrashAlt
            className="cursor-pointer text-danger-300"
            onClick={handleClearMainImage}
          />
        </div>
      )}
      <Input
        className="mb-2"
        name="title"
        placeholder={language === "es" ? "Título del formulario" : "Form title"}
        size="lg"
        style={{ fontSize: "40px" }}
        value={formTitle}
        width="100%"
        onChange={handleChange}
      />
      <Input
        className="mb-2"
        name="description"
        placeholder={
          language === "es" ? "Descripción del formulario" : "Form description"
        }
        size="sm"
        style={{ fontSize: "16px" }}
        value={formDescription}
        width="100%"
        onChange={handleChange}
      />
      <Select
        className="mb-2"
        label="Select category"
        name="category"
        selectedKeys={[formCategory]}
        onChange={handleChange}
      >
        {categories.map((category) => (
          <SelectItem key={category.key}>{category.label}</SelectItem>
        ))}
      </Select>
      <Button
        className="mb-2"
        color="primary"
        radius="lg"
        size="lg"
        variant="bordered"
        onClick={handleMakeNewForm}
      >
        {Loading ? (
          <span className="ml-2">
            <CircularProgress aria-label="Loading" size="md" />
          </span>
        ) : language === "es" ? (
          "Crear nuevo formulario"
        ) : (
          "Create new form"
        )}
      </Button>
      {messageResCreateForm !== "" && (
        <p className="text-center text-red-500">{messageResCreateForm}</p>
      )}
      <div className="flex justify-start items-center gap-2 mb-2 ms-1">
        <label htmlFor="isPublic" style={{ marginRight: "10px" }}>
          {language === "es" ? "Pública" : "Public"}
        </label>
        <Switch
          aria-label="Automatic updates"
          id="isPublic"
          isSelected={isPublicForm}
          onChange={handleChangeIsPublic}
        />
      </div>
      {!isPublicForm && isAddingColaborator && (
        <div className="flex w-full max-w-xs flex-col gap-2 my-3">
          <Autocomplete
            className="max-w-xs"
            defaultItems={userLabels}
            label="Users"
            placeholder="Search user"
            variant="bordered"
            onSelectionChange={handleSelectedUser}
          >
            {(item) => (
              <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
            )}
          </Autocomplete>
        </div>
      )}
      {!isPublicForm && (
        <Card>
          <CardHeader>
            <span className="mr-2">Colaborators</span>
            <Button
              size="sm"
              onPress={() => setIsAddingColaborator((prev) => !prev)}
            >
              <FaUserPlus />
            </Button>
          </CardHeader>
          <CardBody>
            {colaborators?.map((colaborator) => (
              <div
                key={colaborator?.key || new Date().getTime()}
                className="flex justify-start gap-3"
              >
                <p className="text-small text-slate-500">
                  {colaborator?.label || " "}
                </p>
                <FaTrashAlt
                  className="cursor-pointer text-pink-900"
                  onClick={() => handleDeleteColaborator(colaborator)}
                />
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {formValues._id && (
        <Tooltip
          content={language === "es" ? "Agregar pregunta" : "Add question"}
        >
          <Button
            className="mt-2"
            color="primary"
            radius="lg"
            size="lg"
            variant="bordered"
            onClick={addNewQuestion}
          >
            <FaRegSquarePlus />
          </Button>
        </Tooltip>
      )}
    </div>
  );
};

export default HeaderForm;
