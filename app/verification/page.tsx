"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import VerificationCode from "@/components/Verification/VerificationCode";

const MyVerificationPage = () => {
  const searchParams = useSearchParams();
  //eslint-disable-next-line
  //console.log("searchParams:..", searchParams);
  const verificationId = searchParams.get("id");
  const isForgot = searchParams.get("isForgot") || undefined;
  const email = searchParams.get("email") || undefined;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        {verificationId && (
          <VerificationCode
            email={email}
            isForgot={isForgot}
            verificationId={verificationId}
          />
        )}
        {!verificationId && <h6>Verification code not found</h6>}
      </div>
    </Suspense>
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
