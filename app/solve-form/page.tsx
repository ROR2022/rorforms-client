"use client";
import React from "react";
import dynamic from "next/dynamic";
//import SolveForm from "@/components/SolveForm/SolveForm";
const SolveForm = dynamic(() => import("@/components/SolveForm/SolveForm"), {
  ssr: false,
});

const page = () => {
  return (
    <div>
      <SolveForm />
    </div>
  );
};

export default page;
