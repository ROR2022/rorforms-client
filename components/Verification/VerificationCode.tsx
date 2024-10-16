"use client";
import React, { useState, FC, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/react";
import { useLocalStorage } from "usehooks-ts";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { CircularProgress } from "@nextui-org/progress";

//import { IDataWebSocket } from "../WebSocketClient";

import { DataUser, setUser, RootState } from "@/redux/userSlice";
import { LOCALSTORAGE_KEY, COOKIE_KEY } from "@/dataEnv/dataEnv";
import { confirmVerificationCode, updatedPassword } from "@/api/apiUser";

interface VerificationCodeProps {
  verificationId: string;
  isForgot?: string;
  email?: string;
}

const VerificationCode: FC<VerificationCodeProps> = ({
  verificationId,
  isForgot,
  email,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>("en");
  const [storedDataUser, setStoredDataUser] = useLocalStorage<DataUser>(
    LOCALSTORAGE_KEY,
    user
  );
  const [myCode, setMyCode] = useState<string>("");
  const [errorVerification, setErrorVerification] = useState<string>("");
  const [resending, setResending] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  /* const [dataWebSocket, setDataWebSocket] =
    useLocalStorage<IDataWebSocket | null>(WS_KEY, null); */
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  useEffect(() => {}, [resending]);

  useEffect(() => {
    if (storedDataUser && storedDataUser.access_token) {
      //eslint-disable-next-line
      //console.log("storedDataUser:..", storedDataUser);
      router.push("/");
    }
    if (storedDataUser && storedDataUser.language) {
      setSelectedLanguage(storedDataUser.language);
    }
  }, [storedDataUser]);

  useEffect(() => {
    //eslint-disable-next-line
    console.log("isForgot:..", isForgot);
  }, [isForgot]);

  const clearErrorVerification = () => {
    setTimeout(() => {
      setErrorVerification("");
    }, 6000);
  };

  const handleSendCode = async () => {
    //eslint-disable-next-line
    //console.log("myCode:..", myCode, "verificationId:..", verificationId);
    setLoading(true);
    if (myCode === "") {
      setErrorVerification(
        selectedLanguage === "en"
          ? "Please enter the verification code"
          : "Por favor ingrese el código de verificación"
      );
      clearErrorVerification();

      return;
    }
    if (!verificationId || verificationId === "") {
      setErrorVerification(
        selectedLanguage === "en"
          ? "Verification id not found"
          : "Id de verificación no encontrado"
      );
      clearErrorVerification();

      return;
    }
    try {
      setResending(true);
      const resConfirm = await confirmVerificationCode(verificationId, myCode);

      setLoading(false);
      //eslint-disable-next-line
      //console.log("resConfirm:..", resConfirm);
      const { data } = resConfirm;

      if (data) {
        const { dataUser } = data;
        const { access_token } = dataUser;

        if (access_token) {
          //localStorage.setItem("access_token", access_token);
          //window.location.href = "/";
          //eslint-disable-next-line
          console.log("User verified successfully:", dataUser);
          dispatch(setUser(dataUser));
          setStoredDataUser(dataUser);
          /* const tempDataWebSocket = { event: "join", data: dataUser };

          setDataWebSocket({ data: JSON.stringify(tempDataWebSocket) }); */
          Cookies.set(COOKIE_KEY, access_token, {
            expires: 1,
          });
        } else {
          setErrorVerification("Error verifying code no access token");
          clearErrorVerification();
        }
      } else {
        setErrorVerification("Error verifying code no data");
        clearErrorVerification();
      }
    } catch (error) {
      //eslint-disable-next-line
      console.log("error:..", error);
      setLoading(false);
      setErrorVerification("Error verifying code");
      clearErrorVerification();
    }
  };

  const handleRecovery = async () => {
    setLoading(true);
    if (myCode === "") {
      setErrorVerification("Please enter the verification code");
      clearErrorVerification();

      return;
    }
    if (!verificationId || verificationId === "") {
      setErrorVerification("Verification id not found");
      clearErrorVerification();

      return;
    }
    const regexPassword =
      /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

    if (!regexPassword.test(password)) {
      setErrorVerification(
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character, and maximum 20 characters"
      );
      clearErrorVerification();

      return;
    }
    if (password !== confirmPassword) {
      setErrorVerification("Passwords do not match");
      clearErrorVerification();

      return;
    }
    try {
      const myDataRecovery = { email, verificationId, myCode, password };
      const resRecovery = await updatedPassword(myDataRecovery);

      setLoading(false);
      //eslint-disable-next-line
      console.log("resRecovery:..", resRecovery);
      const { data } = resRecovery;

      if (data.success === true) {
        setErrorVerification("Password updated successfully");
        setTimeout(() => {
          router.push("/login");
          setErrorVerification("");
        }, 3000);
      } else {
        setErrorVerification("Error verifying code");
        clearErrorVerification();
      }
    } catch (error) {
      //eslint-disable-next-line
      console.log("error:..", error);
      setLoading(false);
      setErrorVerification("Error verifying code");
      clearErrorVerification();
    }
  };

  return (
    <Card style={{ width: "300px", margin: "auto", marginTop: "50px" }}>
      <CardBody className="flex flex-col gap-2">
        <h5>Verification Code</h5>
        <Input
          placeholder={
            selectedLanguage === "en" ? "Enter your code" : "Ingrese su código"
          }
          type="text"
          value={myCode}
          onChange={(e) => setMyCode(e.target.value)}
        />
        {isForgot === "true" && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <Input
                placeholder={
                  selectedLanguage === "en"
                    ? "New password"
                    : "Nueva contraseña"
                }
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {showPassword ? (
                <FaEye
                  className="cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <FaEyeSlash
                  className="cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
            <div className="flex items-center gap-1">
              <Input
                placeholder={
                  selectedLanguage === "en"
                    ? "Confirm password"
                    : "Confirmar contraseña"
                }
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {showConfirmPassword ? (
                <FaEye
                  className="cursor-pointer"
                  onClick={() => setShowConfirmPassword(false)}
                />
              ) : (
                <FaEyeSlash
                  className="cursor-pointer"
                  onClick={() => setShowConfirmPassword(true)}
                />
              )}
            </div>
          </div>
        )}
        <Button
          color="primary"
          onClick={isForgot === "true" ? handleRecovery : handleSendCode}
        >
          {loading ? (
            <CircularProgress aria-label="Loading..." />
          ) : resending ? (
            selectedLanguage === "en" ? (
              "Resend Code"
            ) : (
              "Reenviar Código"
            )
          ) : selectedLanguage === "en" ? (
            "Send Code"
          ) : (
            "Enviar Código"
          )}
        </Button>
        {errorVerification && (
          <div className="text-red-600 text-sm">{errorVerification}</div>
        )}
      </CardBody>
    </Card>
  );
};

export default VerificationCode;
