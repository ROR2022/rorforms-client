"use client";
import React, { FC, Suspense, useState, useEffect } from "react";

//import { useSearchParams } from "next/navigation";
import Salesforce from "@/components/Salesforce/Salesforce";

interface IGetDataParams {
  setAccessToken: (value: string) => void;
}

const GetDataParams: FC<IGetDataParams> = ({ setAccessToken }) => {
  //const searchParams = useSearchParams();
  //const accessToken = searchParams.get("access_token");

  useEffect(() => {
    const myUrl = window.location.href;
    const dataAccessToken = myUrl.split("access_token=")[1];
    const accessToken = dataAccessToken.split("&")[0];

    //console.log("Salesforce FC accessToken: ", accessToken);
    //console.log("Salesforce FC searchParams: ", searchParams);
    //eslint-disable-next-line
    console.log("Salesforce FC myUrl: ", accessToken);

    if (accessToken) setAccessToken(accessToken);
  }, []);

  return <div style={{display:'none'}}>GetDataParams</div>;
};

const MySFCallback = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <GetDataParams setAccessToken={setAccessToken} />
      </Suspense>
      {accessToken && <Salesforce accessToken={accessToken} />}
    </div>
  );
};

const page = () => {
  return (
    <div>
      <MySFCallback />
    </div>
  );
};

export default page;
