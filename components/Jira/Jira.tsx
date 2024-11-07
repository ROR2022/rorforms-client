"use client";
import { Input } from "@nextui-org/input";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Select,
  SelectItem,
  Spacer,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import axios from "axios";

import {
  initDataPagination,
  IDataPagination,
  itemsPerPage,
} from "../TemplatesNavigation/ShowTemplates";

import TableIssues from "./TableIssues";

import { LOCALSTORAGE_KEY } from "@/dataEnv/dataEnv";
import { DataUser, initialState } from "@/redux/userSlice";
import { getAllIssues } from "@/api/apiIssue";

interface Issue {
  createdAt: string;
  jiraId: string;
  jiraKey: string;
  jiraUrl: string;
  link: string;
  priority: string;
  summary: string;
  template: string;
  updatedAt: string;
  userEmail: string;
  userId: string;
  _id: string;
}

const Jira = () => {
  const [summary, setSummary] = useState("");
  const [priority, setPriority] = useState("Average"); // Valor inicial
  const [link, setLink] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [template, setTemplate] = useState("");
  const [dataIssues, setDataIssues] = useState<Issue[]>([]);
  const [dataPagination, setDataPagination] =
    useState<IDataPagination>(initDataPagination);
  const [storedDataUser] = useLocalStorage<DataUser>(
    LOCALSTORAGE_KEY,
    initialState
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Setea el link a la URL actual
    const tempUrl = new URL(window.location.href);
    const tempParams = tempUrl.searchParams;
    const issueUrl = tempParams.get("issueUrl");

    setLink(issueUrl || "");
    fetchAllIssues("1", "10");
  }, []);

  useEffect(() => {}, [dataIssues]);

  useEffect(() => {
    if (storedDataUser.email) {
      setUserEmail(storedDataUser.email);
    }
  }, [storedDataUser]);

  const fetchAllIssues = async (page: string, limit: string) => {
    try {
      const resIssues = await getAllIssues(
        storedDataUser.access_token,
        page,
        limit
      );
      //eslint-disable-next-line
      console.log("Jira resIssues:..", resIssues.data);

      const { error } = resIssues.data;

      if (error) {
        //eslint-disable-next-line
        console.error("error:..", error);
        alert(`error: ${error}, please try login again`);

        return;
      }

      if (Array.isArray(resIssues.data.docs)) {
        setDataIssues(resIssues.data.docs);
        const { page, limit, totalPages, totalDocs } = resIssues.data;

        setDataPagination({
          page: String(page),
          limit: String(limit),
          totalPages,
          totalDocs,
        });
      }
    } catch (error) {
      console.error("error:..", error);
    }
  };

  const handleSubmit = () => {
    // Llama a la función onSubmit con los datos del formulario
    //onSubmit({ summary, priority, link, userEmail, template });
    console.log({ summary, priority, link, userEmail, template });
    if (summary === "" || template === "") {
      setErrorMessage("Summary and Template are required");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);

      return;
    }
    createTicket();
  };
  const createTicket = async () => {
    try {
      const resCreate = await axios.get(
        `api/create-ticket?summary=${summary}&priority=${priority}&link=${link}&userEmail=${userEmail}&template=${template}&token=${storedDataUser.access_token}`
      );

      console.log("resCreate:..", resCreate.data);
      fetchAllIssues("1", "10");
    } catch (error) {
      console.error("error:..", error);
    }
  };

  const handleSelectPriority = (key: any) => {
    //eslint-disable-next-line
    const { currentKey } = key;
    //console.log("selected priority:..", key);

    setPriority(currentKey);
  };

  const handleChangePage = (page: string) => {
    //eslint-disable-next-line
    //console.log("Change Page:", page);
    setDataPagination({ ...dataPagination, page });
    fetchAllIssues(page, dataPagination.limit);
    //setResetDataFilter(true);
    //setIsFiltering(false);
    /* setTimeout(() => {
      setResetDataFilter(false);
    }, 1000); */
  };

  const handleChangeItemsPerPage = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLimit = e.target.value;
    //eslint-disable-next-line
    console.log("Change Limit:", newLimit);

    setDataPagination({ ...dataPagination, limit: String(newLimit) });
    fetchAllIssues(dataPagination.page, newLimit);
    //setResetDataFilter(true);
    //setIsFiltering(false);
    /* setTimeout(() => {
      setResetDataFilter(false);
    }, 1000); */
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ width: "300px", marginLeft: "auto", marginRight: "auto" }}>
        <form onSubmit={(e) => e.preventDefault()}>
          <Input
            required
            label="Summary"
            placeholder="Enter ticket summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <Spacer y={1} />

          <Input
            readOnly
            label="Priority"
            placeholder="Ticket priority"
            value={priority}
          />

          <Dropdown>
            <DropdownTrigger>
              <Button className="my-2" variant="bordered">
                Select Priority
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Priority"
              selectedKeys={[priority]}
              selectionMode="single"
              onSelectionChange={handleSelectPriority}
            >
              <DropdownItem key="High">High</DropdownItem>
              <DropdownItem key="Average">Average</DropdownItem>
              <DropdownItem key="Low">Low</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Spacer y={1} />

          <Input
            readOnly
            required
            label="User Email"
            placeholder="Your email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <Spacer y={1} />

          <Input
            label="Template"
            placeholder="Enter template name"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          />
          <Spacer y={1} />

          <Input readOnly label="Page Link" value={link} />
          <Spacer y={1} />

          <Button color="primary" onPress={handleSubmit}>
            Create Ticket
          </Button>
          {errorMessage && (
            <div className="text-rose-700 text-sm opacity">{errorMessage}</div>
          )}
        </form>
      </div>
      <Spacer y={1} />
      {dataIssues.length === 0 && (
        <div className="text-danger">No issues found</div>
      )}
      {dataIssues.length > 0 && (
        <div style={{ width: "100%", marginLeft: "auto", marginRight: "auto" }}>
          <div className="flex gap-3 justify-center items-center my-3">
            <div>
              <Pagination
                isCompact
                showControls
                initialPage={Number(dataPagination.page)}
                total={Number(dataPagination.totalPages)}
                onChange={(page) => handleChangePage(String(page))}
              />
            </div>
            <div>
              <Select
                items={itemsPerPage}
                label={`Max Items:`}
                selectedKeys={[dataPagination.limit]}
                style={{ width: "130px" }}
                onChange={(e) => handleChangeItemsPerPage(e)}
              >
                {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
              </Select>
            </div>
          </div>
          <TableIssues dataIssues={dataIssues} />
        </div>
      )}
    </div>
  );
};

export default Jira;
