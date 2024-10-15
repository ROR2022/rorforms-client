"use client";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody } from "@nextui-org/react";
import React from "react";

const Error = () => {
  const router = useRouter();
  const handleHome = () => {
    router.push("/");
  };

  return (
    <Card style={{ width: "300px", maxWidth: "600px", margin: "auto" }}>
      <CardBody>
        <p className="text-violet-700 mb-4">
          This resource is not available or is not accesible
        </p>
        <Button color="danger" onClick={handleHome}>
          Home
        </Button>
      </CardBody>
    </Card>
  );
};

export default Error;
