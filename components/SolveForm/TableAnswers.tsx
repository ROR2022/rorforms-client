import React, { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  CircularProgress,
} from "@nextui-org/react";

import { IAnswerForm } from "./SolveForm";

import { getAnswersByTemplateId } from "@/api/apiForm";

interface ITableAnswers {
  templateId: string;
  setIsEditing: (data: IAnswerForm | null) => void;
}

const columns = [
  { key: "userName", label: "Name" },
  { key: "userEmail", label: "Email" },
  { key: "createdAt", label: "Creation Date" },
];

const TableAnswers: FC<ITableAnswers> = ({ templateId, setIsEditing }) => {
  const router = useRouter();
  const [answers, setAnswers] = useState<IAnswerForm[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    //eslint-disable-next-line
    //console.log("TableAnswers:", templateId);
    if (templateId) fetchData();
    else router.push("/");
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAnswersByTemplateId(templateId);
      //eslint-disable-next-line
      //console.log("Answers By TemplateId:", res);
      const { data } = res;

      setLoading(false);
      if (data) {
        //eslint-disable-next-line
        console.log("Data:", data);
        const tempData = data.map((item: IAnswerForm) => {
          return {
            ...item,
            createdAt: new Date(item.createdAt || "").toLocaleString(),
          };
        });

        setAnswers(tempData);
      }
    } catch (error) {
      //eslint-disable-next-line
      console.error("Error fetching answers", error);
      setLoading(false);
    }
  };

  const handleClickRow = (item: IAnswerForm) => {
    //eslint-disable-next-line
    //console.log("Click Row:", item);
    //router.push(`/view-answer?id=${item._id}`);
    setIsEditing(item);
  };

  return (
    <div className="my-4">
      <div className="flex justify-center">
        {loading && <CircularProgress aria-label="loading..." />}
      </div>
      {answers.length > 0 && !loading && (
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={answers}>
            {(item) => (
              <TableRow
                key={item._id}
                className="hover:bg-slate-800 hover:text-purple-700 cursor-pointer"
                onClick={() => handleClickRow(item)}
              >
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TableAnswers;
