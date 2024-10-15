import React, { FC, useState, useEffect, useRef } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  Button,
  Card,
  CardBody,
  Input,
  Textarea,
  Image,
} from "@nextui-org/react";
import { CiSquarePlus } from "react-icons/ci";
import { RadioGroup, Radio } from "@nextui-org/react";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { MdMoreVert } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";

import MainControls from "./MainControls";
import { generateUniqueId } from "./BasicDrag/Container";
//import MiniModal from "./MiniModal";

export interface IBasicQuestion {
  _id?: string;
  templateId: string;
  title: string;
  imageUrl: string;
  answer: string;
  listAnswers: Array<ISelectItem>;
  type: string;
  required: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const initQuestionValues: IBasicQuestion = {
  templateId: "",
  title: "",
  imageUrl: "",
  answer: "",
  listAnswers: [],
  type: "short",
  required: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

interface BasicQuestionProps {
  dataQuestion: IBasicQuestion;
  updateQuestion: (dataQ: IBasicQuestion) => Promise<IBasicQuestion>;
  handleSelectQuestion: (dataQ: IBasicQuestion) => void;
}

export interface ISelectItem {
  value: string;
  label: string;
}

const BasicQuestion: FC<BasicQuestionProps> = ({
  dataQuestion,
  updateQuestion,
  handleSelectQuestion,
}) => {
  const [questionValues, setQuestionValues] =
    useState<IBasicQuestion>(initQuestionValues);
  const [showMenu, setShowMenu] = useState(false);
  const [radioOptions, setRadioOptions] = useState<ISelectItem[]>([
    { value: "option1", label: "Option1" },
  ]);
  const [checkboxOptions, setCheckboxOptions] = useState<ISelectItem[]>([
    { value: "value1", label: "Value1" },
  ]);
  const [isAddingItems, setIsAddingItems] = useState<ISelectItem[]>([]);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [tempLabel, setTempLabel] = useState("");
  const [dataModal, setDataModal] = useState({
    type: "",
    value: "",
    label: "",
  });

  useEffect(() => {
    setQuestionValues(dataQuestion);
    if (dataQuestion.type === "multiple") {
      setRadioOptions(dataQuestion.listAnswers);
    }
    if (dataQuestion.type === "checkbox") {
      setCheckboxOptions(dataQuestion.listAnswers);
    }
  }, [dataQuestion]);

  useEffect(() => {
    //setQuestionValues(dataQuestion);
    //console.log("Question values:", questionValues);
  }, [questionValues]);

  useEffect(() => {
    //setQuestionValues(dataQuestion);
  }, [isMobile]);

  useEffect(() => {
    if (isAddingItems.length > 0 && questionValues.type === "multiple") {
      updateQuestion({ ...questionValues, listAnswers: isAddingItems });
      setIsAddingItems([]);
    }
  }, [radioOptions]);

  useEffect(() => {
    if (isAddingItems.length > 0 && questionValues.type === "checkbox") {
      updateQuestion({ ...questionValues, listAnswers: isAddingItems });
      setIsAddingItems([]);
    }
  }, [checkboxOptions]);

  useEffect(() => {}, [dataModal]);

  const handleChangeTitle = (e: any) => {
    const { name, value } = e.target;

    const newQuestion = {
      ...questionValues,
      [name]: value,
    };

    setQuestionValues(newQuestion);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      updateQuestion(newQuestion);
    }, 1500);
  };

  const handleMultiple = (e: any) => {
    //eslint-disable-next-line
    console.log("Multiple:", e.target.value);
  };

  const handleCheckbox = (values: string[]) => {
    //eslint-disable-next-line
    console.log("Checkbox:", values);
  };

  /* const handleIsAddingItems = (items: ISelectItem[]) => {
    setIsAddingItems(items);
  }; */

  const handleMoreRadio = () => {
    //console.log("More radio");
    setRadioOptions((prev) => {
      const newRadioOptions = [
        ...prev,
        {
          value: `option${prev.length + 1}`,
          label: `Option${prev.length + 1}`,
        },
      ];

      setQuestionValues((prev) => ({
        ...prev,
        listAnswers: newRadioOptions,
      }));

      setIsAddingItems(newRadioOptions);
      //updateQuestion({ ...questionValues, listAnswers: newRadioOptions });

      return newRadioOptions;
    });
    //setQuestionValues((prev) => ({
  };

  const handleMoreCheck = async () => {
    //console.log("More check");
    setCheckboxOptions((prev) => {
      const newCheckOptions = [
        ...prev,
        { value: `value${prev.length + 1}`, label: `Value${prev.length + 1}` },
      ];

      setQuestionValues((prev) => {
        const newQuestionValues = {
          ...prev,
          listAnswers: newCheckOptions,
        };

        setIsAddingItems(newCheckOptions);

        return newQuestionValues;
      });

      return newCheckOptions;
    });
  };

  const handleChangeLabelOption = (dataOption: ISelectItem) => {
    //e.preventDefault();
    //console.log("Change label option:", dataOption);
    const { label, value } = dataOption;

    setRadioOptions((prev) => {
      const newOptions = prev.map((option) =>
        option.value === value ? { ...option, label: label } : option
      );

      setQuestionValues((prev) => ({
        ...prev,
        listAnswers: newOptions,
      }));
      setIsAddingItems(newOptions);
      //updateQuestion({ ...questionValues, listAnswers: newOptions });

      return newOptions;
    });
    setTempLabel("");
  };

  const handleChangeLabelCheck = (dataOption: ISelectItem) => {
    //console.log("Change label check:", dataOption);
    const { label, value } = dataOption;

    setCheckboxOptions((prev) => {
      const newOptions = prev.map((option) =>
        option.value === value ? { ...option, label: label } : option
      );

      setQuestionValues((prev) => ({
        ...prev,
        listAnswers: newOptions,
      }));
      //updateQuestion({ ...questionValues, listAnswers: newOptions });

      setIsAddingItems(newOptions);

      return newOptions;
    });

    setTempLabel("");
  };

  const handleDeleteLabelCheck = (dataOption: ISelectItem) => {
    const { value } = dataOption;

    setCheckboxOptions((prev) => {
      const newOptions = prev.filter((option) => option.value !== value);

      setQuestionValues((prev) => ({
        ...prev,
        listAnswers: newOptions,
      }));
      //updateQuestion({ ...questionValues, listAnswers: newOptions });

      setIsAddingItems(newOptions);

      return newOptions;
    });

    setTempLabel("");
    setDataModal({ type: "", value: "", label: "" });
  };

  const handleDeleteLabelOption = (dataOption: ISelectItem) => {
    const { value } = dataOption;

    setRadioOptions((prev) => {
      const newOptions = prev.filter((option) => option.value !== value);

      setQuestionValues((prev) => ({
        ...prev,
        listAnswers: newOptions,
      }));
      //updateQuestion({ ...questionValues, listAnswers: newOptions });

      setIsAddingItems(newOptions);

      return newOptions;
    });

    setTempLabel("");
    setDataModal({ type: "", value: "", label: "" });
  };

  const handleShowMiniModal = (type: string, option: ISelectItem) => {
    //console.log("Show mini modal:", type, option);
    setDataModal({ ...option, type });
  };

  const handleClearMainImage = () => {
    setQuestionValues({ ...questionValues, imageUrl: "" });
    updateQuestion({ ...questionValues, imageUrl: "" });
  };

  return (
    <Card
      style={{ width: "100%" }}
      onClick={() => handleSelectQuestion(dataQuestion)}
    >
      <CardBody>
        <div className={isMobile ? "flex gap-2" : "flex flex-col gap-2"}>
          <div
            className={
              isMobile
                ? "flex flex-col gap-2 justify-center items-center"
                : "flex gap-2 justify-center items-center"
            }
          >
            <button
              className="flex justify-center items-center"
              style={{
                width: "30px",
                border: ".5px solid #5564eb",
                height: "80%",
                maxHeight: "40px",
                borderRadius: "5px",
                color: "#5564eb",
                backgroundColor: "inherit",
              }}
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <MdMoreVert />
            </button>
            {showMenu && (
              <MainControls
                activeQuestion={dataQuestion}
                updateQuestion={updateQuestion}
              />
            )}
          </div>

          <div style={{ width: "100%" }}>
            {questionValues.imageUrl && (
              <div className="flex justify-center items-center gap-3">
                <Image
                  alt="Main image"
                  className="mb-2"
                  src={questionValues.imageUrl}
                  width="200px"
                />
                <FaTrashAlt
                  className="cursor-pointer text-danger-300"
                  onClick={handleClearMainImage}
                />
              </div>
            )}
            <Input
              className="mb-1"
              name="title"
              placeholder="Question title"
              size="md"
              style={{ fontSize: "18px" }}
              value={questionValues.title}
              width="100%"
              onChange={handleChangeTitle}
            />

            {questionValues.type === "short" && (
              <Input
                className="mb-2"
                isDisabled={true}
                placeholder="Short answer"
                size="sm"
                style={{ fontSize: "12px" }}
                value={questionValues.answer}
                width="100%"
              />
            )}

            {questionValues.type === "long" && (
              <Textarea
                className="mb-2"
                placeholder="Long answer"
                size="sm"
                style={{ fontSize: "12px" }}
                value={questionValues.answer}
                width="100%"
              />
            )}

            {questionValues.type === "numeric" && (
              <Input
                className="mb-2"
                placeholder="Numeric answer"
                size="sm"
                style={{ fontSize: "12px" }}
                value={questionValues.answer}
                width="100%"
              />
            )}

            {questionValues.type === "multiple" && (
              <div>
                <Button className="my-2" size="sm" onClick={handleMoreRadio}>
                  <CiSquarePlus />
                </Button>
                <RadioGroup label="" onChange={handleMultiple}>
                  {radioOptions.map((option) => (
                    <Radio key={generateUniqueId()} value={option.value}>
                      <button
                        onClick={() => {
                          handleShowMiniModal("option", option);
                          setTempLabel(option.label);
                        }}
                      >
                        {option.label}
                      </button>
                    </Radio>
                  ))}
                </RadioGroup>
              </div>
            )}

            {dataModal.type === "option" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  zIndex: 1000,
                  top: isMobile ? "50%" : "50%",
                  left: isMobile ? "50%" : "20%",
                }}
              >
                <Button
                  color="secondary"
                  size="sm"
                  variant="bordered"
                  onClick={() =>
                    handleDeleteLabelOption({
                      label: tempLabel,
                      value: dataModal.value,
                    })
                  }
                >
                  <FaTrashAlt /> Delete
                </Button>
                <Input
                  label="Change label"
                  name="tempLabel"
                  placeholder="Check label"
                  value={tempLabel}
                  onChange={(e) => setTempLabel(e.target.value)}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    handleChangeLabelOption({
                      label: tempLabel,
                      value: dataModal.value,
                    });
                    setDataModal({ type: "", value: "", label: "" });
                  }}
                >
                  Done
                </Button>
              </div>
            )}

            {questionValues.type === "checkbox" && (
              <div>
                <Button className="my-2" size="sm" onClick={handleMoreCheck}>
                  <CiSquarePlus />
                </Button>
                <CheckboxGroup label="" onChange={handleCheckbox}>
                  <div className="flex flex-col justify-center">
                    {checkboxOptions.map((option) => (
                      <Checkbox key={generateUniqueId()} value={option.value}>
                        <button
                          onClick={() => {
                            handleShowMiniModal("check", option);
                            setTempLabel(option.label);
                          }}
                        >
                          {option.label}
                        </button>
                      </Checkbox>
                    ))}
                  </div>
                </CheckboxGroup>
              </div>
            )}

            {dataModal.type === "check" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  top: isMobile ? "50%" : "50%",
                  left: isMobile ? "50%" : "20%",
                }}
              >
                <Button
                  color="secondary"
                  size="sm"
                  variant="bordered"
                  onClick={() =>
                    handleDeleteLabelCheck({
                      label: tempLabel,
                      value: dataModal.value,
                    })
                  }
                >
                  <FaTrashAlt /> Delete
                </Button>
                <Input
                  label="Change label"
                  name="tempLabel"
                  placeholder="Option label"
                  value={tempLabel}
                  onChange={(e) => setTempLabel(e.target.value)}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    handleChangeLabelCheck({
                      label: tempLabel,
                      value: dataModal.value,
                    });
                    setDataModal({ type: "", value: "", label: "" });
                  }}
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default BasicQuestion;
