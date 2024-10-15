"use client";
import React, { FC, Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import VerificationCode from "@/components/Verification/VerificationCode";

interface IGetDataParams {
  setVerificationId: (value: string) => void;
  setIsForgot: (value: string) => void;
  setEmail: (value: string) => void;
}

const GetDataParams: FC<IGetDataParams> = ({
  setVerificationId,
  setIsForgot,
  setEmail,
}) => {
  const searchParams = useSearchParams();
  const verificationId = searchParams.get("id");
  const isForgot = searchParams.get("isForgot") || undefined;
  const email = searchParams.get("email") || undefined;

  useEffect(() => {
    if (verificationId) setVerificationId(verificationId);
    if (isForgot) setIsForgot(isForgot);
    if (email) setEmail(email);
  }, [verificationId, isForgot, email]);

  return <div style={{ display: "none" }}>GetDataParams</div>;
};

const MyVerificationPage = () => {
  //eslint-disable-next-line
  //console.log("searchParams:..", searchParams);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [isForgot, setIsForgot] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <GetDataParams
          setEmail={setEmail}
          setIsForgot={setIsForgot}
          setVerificationId={setVerificationId}
        />
      </Suspense>
      {verificationId && (
        <VerificationCode
          email={email || ""}
          isForgot={isForgot || ""}
          verificationId={verificationId || ""}
        />
      )}
      {!verificationId && <h6>Verification code not found</h6>}
    </div>
  );
};

const page = () => {
  return (
    <div>
      <MyVerificationPage />
    </div>
  );
};

export default page;
