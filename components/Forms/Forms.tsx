"use client";
import React from "react";

import ShowTemplates from "../TemplatesNavigation/ShowTemplates";

const Forms = () => {
  return (
    <div>
      <h3 className="text-slate-500 text-center my-4 text-4xl">
        Forms Navigation
      </h3>
      <ShowTemplates isForms={true} />
    </div>
  );
};

export default Forms;
