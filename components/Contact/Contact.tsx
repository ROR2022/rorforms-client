"use client";
import React, { useState, FC, useEffect } from "react";
import { Input, Button, Spacer, Card, Textarea } from "@nextui-org/react";
//@nextui-org/react

import { phoneUser } from "@/dataEnv/dataEnv";

const Contact: FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorForm, setErrorForm] = useState("");

  useEffect(() => {
    if (errorForm) {
      setTimeout(() => {
        setErrorForm("");
      }, 2000);
    }
  }, [errorForm]);

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
        <h3 style={{ textAlign: "center" }}>Contact Me</h3>
        <form noValidate autoComplete="off">
          <div className="flex flex-col gap-2">
            <div className="">
              <Input
                fullWidth
                required
                label="Name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="">
              <Input
                fullWidth
                required
                label="Email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Textarea
                fullWidth
                required
                label="Message"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div>
              <Button fullWidth color="primary" onClick={handleSubmit}>
                Send
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
