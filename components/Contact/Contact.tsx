"use client";
import React, { useState, FC, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Input, Button, Spacer, Card, Textarea } from "@nextui-org/react";
//@nextui-org/react

import { LOCALSTORAGE_KEY, phoneUser } from "@/dataEnv/dataEnv";
import { DataUser, initialState } from "@/redux/userSlice";

const Contact: FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorForm, setErrorForm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [storedDataUser] = useLocalStorage<DataUser>(
    LOCALSTORAGE_KEY,
    initialState
  );

  useEffect(() => {
    if (errorForm) {
      setTimeout(() => {
        setErrorForm("");
      }, 2000);
    }
  }, [errorForm]);

  useEffect(() => {
    if (storedDataUser && storedDataUser.language) {
      setSelectedLanguage(storedDataUser.language);
    }
  }, [storedDataUser]);

  const handleSubmit = () => {
    if (!name || !email || !message) {
      setErrorForm("Please fill all fields");

      return;
    }
    setErrorForm("");
    const phoneNumber = phoneUser;
    const whatsappMessage = `Hi, I am ${name}. My email is ${email}. ${message}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div>
      <Card
        style={{
          padding: "10px",
          width: "350px",
          marginTop: "10px",
          backgroundColor: "",
        }}
      >
        <h3 className="text-4xl mb-4" style={{ textAlign: "center" }}>
          {selectedLanguage === "en" ? "Contact Me" : "Contáctame"}
        </h3>
        <form noValidate autoComplete="off">
          <div className="flex flex-col gap-2">
            <div className="">
              <Input
                fullWidth
                required
                label={selectedLanguage === "en" ? "Name" : "Nombre"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="">
              <Input
                fullWidth
                required
                label={selectedLanguage === "en" ? "Email" : "Correo"}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Textarea
                fullWidth
                required
                label={selectedLanguage === "en" ? "Message" : "Mensaje"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div>
              <Button fullWidth color="primary" onClick={handleSubmit}>
                {selectedLanguage === "en" ? "Send" : "Enviar"}
              </Button>
              <Spacer y={1} />
              {errorForm && (
                <p color="error" style={{ textAlign: "center" }}>
                  {errorForm}
                </p>
              )}
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Contact;
