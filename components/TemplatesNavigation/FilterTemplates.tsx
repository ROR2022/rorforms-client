import React, { useState, useEffect, FC } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useLocalStorage } from "usehooks-ts";
//import { CiFilter } from "react-icons/ci";
import { MdFilterAltOff } from "react-icons/md";
import { Button, Input, Select, SelectItem, Tooltip } from "@nextui-org/react";

import { categories } from "../FormTemplate/HeaderForm";

import { LOCALSTORAGE_KEY } from "@/dataEnv/dataEnv";
import { DataUser, initialState } from "@/redux/userSlice";

export const owners = [
  { key: "owner1", label: "I am the author" },
  { key: "owner2", label: "I am not the author" },
  { key: "owner3", label: "All" },
];

export const topFive = [
  { key: "top1", label: "More Filled Forms" },
  { key: "top2", label: "More Likes" },
  { key: "top3", label: "More Comments" },
];

export interface IOwner {
  key: string;
  label: string;
}

export const initDataFilter = {
  top: { key: "", label: "" },
  category: { key: "", label: "" },
  owner: { key: "", label: "" },
  search: "",
};

export interface IFilter {
  top: IOwner;
  category: IOwner;
  owner: IOwner;
  search: string;
}

const mainClassMobile = "flex flex-col justify-center items-center gap-2 mt-3";
const mainClassDesktop = "flex justify-center items-center gap-2 mt-3";

interface IFilterTemplates {
  handleSetDataFilter: (filter: IFilter) => void;
  fetchTemplates: (page: string, limit: string) => void;
  resetDataFilter: boolean;
}

const FilterTemplates: FC<IFilterTemplates> = ({
  handleSetDataFilter,
  fetchTemplates,
  resetDataFilter,
}) => {
  const [filter, setFilter] = useState<IFilter>(initDataFilter);
  const [mainClass, setMainClass] = useState<string>(mainClassDesktop);
  const [storedDataUser] = useLocalStorage<DataUser>(
    LOCALSTORAGE_KEY,
    initialState,
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const isMobile = useMediaQuery("(max-width: 700px)");

  useEffect(() => {
    if (isMobile) {
      setMainClass(mainClassMobile);
    } else {
      setMainClass(mainClassDesktop);
    }
  }, [isMobile]);

  useEffect(() => {
    if (resetDataFilter) {
      setFilter(initDataFilter);
    }
  }, [resetDataFilter]);

  useEffect(() => {
    if (storedDataUser && storedDataUser.language) {
      setSelectedLanguage(storedDataUser.language);
    }
  }, [storedDataUser]);

  useEffect(() => {
    //eslint-disable-next-line
    //console.log("Filter:", filter);
  }, [filter]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    //eslint-disable-next-line
    //console.log("Select:", name, value);

    let objSelected = null;

    if (name === "category") {
      objSelected = categories.find(
        (category) => category.key === value,
      ) as IOwner;
    }
    if (name === "owner") {
      objSelected = owners.find((owner) => owner.key === value) as IOwner;
    }
    if (name === "top") {
      objSelected = topFive.find((top) => top.key === value) as IOwner;
    }
    const newFilter = { ...filter, [name]: objSelected };

    handleFilterTemplates(newFilter);
    setFilter({ ...newFilter });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    //eslint-disable-next-line
    //console.log("Search:", value);

    const newFilter = { ...filter, search: value };

    setFilter({ ...newFilter });

    if (value.length >= 3) {
      handleFilterTemplates(newFilter);
    }
  };

  const handleFilterTemplates = (myFilter: IFilter) => {
    //eslint-disable-next-line
    //console.log("Filter:", filter);
    handleSetDataFilter(myFilter);
  };

  const handleClearFilters = () => {
    //console.log("Clear filters");
    setFilter(initDataFilter);
    fetchTemplates("1", "10");
  };

  return (
    <div className={mainClass}>
      <Select
        className="max-w-xs"
        label={
          selectedLanguage === "en"
            ? "Select top five"
            : "Seleccionar top cinco"
        }
        name="top"
        selectedKeys={[filter.top.key]}
        onChange={handleSelect}
      >
        {topFive.map((top) => (
          <SelectItem key={top.key} textValue={top.label}>
            {top.label}
          </SelectItem>
        ))}
      </Select>
      <Select
        className="max-w-xs"
        label={
          selectedLanguage === "en"
            ? "Select category"
            : "Seleccionar categoría"
        }
        name="category"
        selectedKeys={[filter.category.key]}
        onChange={handleSelect}
      >
        {categories.map((category) => (
          <SelectItem key={category.key} textValue={category.label}>
            {category.label}
          </SelectItem>
        ))}
      </Select>
      <Select
        className="max-w-xs"
        label={
          selectedLanguage === "en" ? "Select author" : "Seleccionar autor"
        }
        name="owner"
        selectedKeys={[filter.owner.key]}
        onChange={handleSelect}
      >
        {owners.map((owner) => (
          <SelectItem key={owner.key} textValue={owner.label}>
            {owner.label}
          </SelectItem>
        ))}
      </Select>
      <Input
        className="max-w-xs"
        placeholder={
          selectedLanguage === "en"
            ? "🔍 Search by title or description"
            : "🔍 Busqueda por título o descripción"
        }
        size="lg"
        value={filter.search}
        onChange={handleSearch}
      />

      {/* <Tooltip content="Filter templates" placement="top">
        <Button
          color="secondary"
          radius="lg"
          size="sm"
          variant="bordered"
          onPress={handleFilterTemplates}
        >
          <CiFilter size={20} />
        </Button>
      </Tooltip> */}
      <Tooltip content="Clear Filters" placement="top">
        <Button
          color="secondary"
          radius="lg"
          size="sm"
          variant="bordered"
          onPress={handleClearFilters}
        >
          <MdFilterAltOff size={20} />
        </Button>
      </Tooltip>
    </div>
  );
};

export default FilterTemplates;
