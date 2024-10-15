import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "usehooks-ts";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

import {
  COOKIE_KEY,
  hostURL,
  LOCALSTORAGE_KEY,
  WS_KEY,
} from "@/dataEnv/dataEnv";
import { initialState, setUser } from "@/redux/userSlice";

let socket: Socket;

export interface IDataWebSocket {
  data: string;
}

const WebSocketClient = () => {
  const [storedDataUser, setStoredDataUser] = useLocalStorage(
    LOCALSTORAGE_KEY,
    initialState
  );
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [, setUsersOnline] = useLocalStorage<any>("usersOnline", []);
  const [dataWebSocket, setDataWebSocket] =
    useLocalStorage<IDataWebSocket | null>(WS_KEY, null);
  const [updatedTemplateId, setUpdatedTemplateId] = useLocalStorage<string>(
    "updatedTemplateId",
    ""
  );
  const [, setReloadTemplateId] = useLocalStorage<string>(
    "reloadTemplateId",
    ""
  );

  useEffect(() => {
    socket = io(`${hostURL}`);

    socket.on("connect", () => {
      //eslint-disable-next-line
      console.log("Connected to WebSocket server");
    });

    socket.on("newClients", (data: any) => {
      //eslint-disable-next-line
      //console.log("newClients from server:", data);
      setUsersOnline([...data]);
    });

    socket.on("reloadTemplateId", (data: string) => {
      //eslint-disable-next-line
      console.log("Reload templateId:", data);
      setReloadTemplateId(data);
    });

    socket.on("hasToLogout", (data: string) => {
      //eslint-disable-next-line
      console.log("logout from server:", data);
      //const objData = JSON.parse(data);
      //const tempMyUserEmail = storedDataUser.email;
      //eslint-disable-next-line
      console.log("storedDataUser:..", storedDataUser);

      /* if (tempMyUserEmail === objData.email) {
        handleLogOut();
      } */
      handleLogOut();
    });

    return () => {
      socket.disconnect();
      setIsJoined(false);
      //eslint-disable-next-line
      console.error("Disconnected from WebSocket server");
    };
  }, []);

  useEffect(() => {
    if (updatedTemplateId && updatedTemplateId !== "") {
      socket?.emit("updatedTemplateId", updatedTemplateId);
      setUpdatedTemplateId("");
    }
  }, [updatedTemplateId]);

  useEffect(() => {
    if (dataWebSocket !== null) {
      const tempData = JSON.parse(dataWebSocket.data);
      //eslint-disable-next-line
      console.log("dataWebSocket.data:..", tempData);

      socket?.emit(tempData.event, JSON.stringify(tempData.data));
      setDataWebSocket(null);
    }
  }, [dataWebSocket]);

  useEffect(() => {
    //eslint-disable-next-line
    //console.log("storedDataUser:..", storedDataUser);
    if (storedDataUser && storedDataUser.access_token && !isJoined) {
      //const tempDataWebSocket = { event: "join", data: storedDataUser };

      socket?.emit("join", JSON.stringify(storedDataUser));
      setIsJoined(true);
      //setDataWebSocket({ data: JSON.stringify(tempDataWebSocket) });
    }
    if (!storedDataUser.access_token && isJoined) {
      setIsJoined(false);
    }
  }, [storedDataUser]);

  const handleLogOut = () => {
    dispatch(setUser(initialState));
    setStoredDataUser(initialState);
    Cookies.remove(COOKIE_KEY);
    router.push("/");
  };

  return <div className="hidden">WebSocketClient</div>;
};

export default WebSocketClient;
