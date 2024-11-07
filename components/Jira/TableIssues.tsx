import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { FC, useEffect } from "react";

interface TableIssuesProps {
  dataIssues: any[];
}

/*
createdAt: string;
  
  
  jiraUrl: string;
  link: string;
  priority: string;
  summary: string;
  template: string;
  updatedAt: string;
  userEmail: string;
  userId: string;
  _id: string;
*/

const issueColumns = [
  { key: "createdAt", label: "Created At" },
  { key: "jiraUrl", label: "Jira URL" },
  { key: "link", label: "Link" },
  { key: "priority", label: "Priority" },
  { key: "summary", label: "Summary" },
  { key: "template", label: "Template" },
  { key: "userEmail", label: "User Email" },
];

const TableIssues: FC<TableIssuesProps> = ({ dataIssues }) => {
  useEffect(() => {
    console.log("dataIssues:..", dataIssues);
  }, [dataIssues]);

  return (
    <Table aria-label="Example table with dynamic content">
      <TableHeader columns={issueColumns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={dataIssues}>
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TableIssues;
