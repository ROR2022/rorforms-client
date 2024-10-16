"use client";
import React, { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/progress";

import { findUserByEmail, createVerification } from "@/api/apiUser";
import { LOCALSTORAGE_KEY } from "@/dataEnv/dataEnv";
import { DataUser, initialState } from "@/redux/userSlice";

const Forgot = () => {
  const [emailUser, setEmailUser] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>("en");
  const [storedDataUser] = useLocalStorage<DataUser>(
    LOCALSTORAGE_KEY,
    initialState
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (storedDataUser && storedDataUser.language) {
      setSelectedLanguage(storedDataUser.language);
    }
  }, [storedDataUser]);

  const handleChangeEmail = (e: any) => {
    setEmailUser(e.target.value);
  };

  const clearErrorEmail = () => {
    setTimeout(() => {
      setErrorEmail("");
      setLoading(false);
    }, 3000);
  };

  const handleSendEmail = async () => {
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!regexEmail.test(emailUser)) {
      //eslint-disable-next-line
      console.log("Invalid email address");
      setErrorEmail("Invalid email address");
      setTimeout(() => {
        setErrorEmail("");
      }, 2000);

      return;
    }
    //eslint-disable-next-line
    //console.log("Sending email to:", emailUser);
    try {
      setLoading(true);
      const findEmail = await findUserByEmail(emailUser);
      //eslint-disable-next-line
      //console.log("findEmail:", findEmail);

      if (findEmail.data && findEmail.data.email) {
        const createVerif = await createVerification(emailUser);
        //eslint-disable-next-line
        console.log("createVerif:", createVerif);
        if (createVerif.data.verification) {
          const verificationId = createVerif.data.verification;
          //eslint-disable-next-line
          console.log(
            "Verification created successfully",
            createVerif.data.verification
          );
          router.push(
            `/verification?id=${verificationId}&isForgot=true&email=${emailUser}`
          );
          setLoading(false);
        } else {
          //eslint-disable-next-line
          console.log("Error creating verification");
          setErrorEmail("Error creating verification");
          clearErrorEmail();
        }
      } else {
        //eslint-disable-next-line
        console.log("Email not found");
        setErrorEmail("Email not found");
        clearErrorEmail();
      }
    } catch (error) {
      //eslint-disable-next-line
      console.error("Error sending email:", error);
      setErrorEmail("Error sending email");
      clearErrorEmail();
    }
  };

  return (
    <div
      className="mt-3"
      style={{ width: "300px", maxWidth: "600px", margin: "auto" }}
    >
      <Card>
        <CardBody className="flex flex-col gap-2">
          <label htmlFor="emailUserInput">
            {selectedLanguage === "en"
              ? "Enter your email address"
              : "Ingresa tu dirección de correo electrónico"}
          </label>
          <Input
            id="emailUserInput"
            placeholder="Email"
            onChange={handleChangeEmail}
          />
          <Button
            color="primary"
            disabled={loading}
            type="button"
            onClick={handleSendEmail}
          >
            {loading ? (
              <div className="text-white">
                <CircularProgress aria-label="Loading..." />
              </div>
            ) : selectedLanguage === "en" ? (
              "Send email"
            ) : (
              "Enviar correo electrónico"
            )}
          </Button>
          {errorEmail && (
            <div className="text-purple-600 text-sm opacity">{errorEmail}</div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Forgot;
