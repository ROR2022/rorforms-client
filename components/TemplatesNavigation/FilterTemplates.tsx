import React, { useState, useEffect, FC } from "react";
import { useMediaQuery } from "usehooks-ts";
import { CiFilter } from "react-icons/ci";
import { MdFilterAltOff } from "react-icons/md";
import { Button, Input, Select, SelectItem, Tooltip } from "@nextui-org/react";

import { categories } from "../FormTemplate/HeaderForm";

export const owners = [
  { key: "owner1", label: "I am the author" },
  { key: "owner2", label: "I am not the author" },
  { key: "owner3", label: "All" },
];

export interface IOwner {
  key: string;
  label: string;
}

export const initDataFilter = {
  category: { key: "", label: "" },
  owner: { key: "", label: "" },
  search: "",
};

export interface IFilter {
  category: IOwner;
  owner: IOwner;
  search: string;
}

const mainClassMobile = "flex flex-col justify-center items-center gap-2 mt-3";
const mainClassDesktop = "flex justify-center items-center gap-2 mt-3";

interface IFilterTemplates {
  handleSetDataFilter: (filter: IFilter) => void;
  fetchTemplates: () => void;
}

const FilterTemplates: FC<IFilterTemplates> = ({
  handleSetDataFilter,
  fetchTemplates,
}) => {
  const [filter, setFilter] = useState<IFilter>(initDataFilter);
  const [mainClass, setMainClass] = useState<string>(mainClassDesktop);
  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    if (isMobile) {
      setMainClass(mainClassMobile);
    } else {
      setMainClass(mainClassDesktop);
    }
  }, [isMobile]);

  useEffect(() => {
    //eslint-disable-next-line
    //console.log("Filter:", filter);
  }, [filter]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    //eslint-disable-next-line
    console.log("Select:", name, value);

    let objSelected = null;

    if (name === "category") {
      objSelected = categories.find(
        (category) => category.key === value
      ) as IOwner;
    } else {
      objSelected = owners.find((owner) => owner.key === value) as IOwner;
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
    fetchTemplates();
  };

  return (
    <div className={mainClass}>
      <Select
        className="max-w-xs"
        label="Select category"
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
        label="Select author"
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
        placeholder="🔍 Search by title or description"
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
