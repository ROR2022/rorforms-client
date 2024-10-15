import React from "react";
import dynamic from "next/dynamic";
const PrePageCreate = dynamic(
  () => import("@/components/FormTemplate/PrePageCreate"),
  { ssr: false }
);

const page = () => {
  return <PrePageCreate />;
};

export default page;
