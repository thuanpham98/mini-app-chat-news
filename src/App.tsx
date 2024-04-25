import "@/styles";
import "./index.css";
import { useEffect, useRef, useState } from "react";
import { RdModulesManager, useRdQuery } from "@radts/reactjs";
import {
  MessageReponse,
  MessageRequest,
  MessageType,
} from "./infrastructure/message-protobuf/message";
import { AppRepository } from "./application/services/app-repository";
import { AppSession } from "./application/services/app-session";
import MessageFrame from "./components/message-frame/MessageFrame";
import { imgChatBg } from "./application/services/assets";
import { Environment } from "./application/services/environment";

function App() {
  const [isLoading, setLoading] = useState(true);

  const refFormMessage = useRef<HTMLFormElement>(null);
  const refTextMessage = useRef<HTMLTextAreaElement>(null);

  const {
    isLoading: isLoadingUserInfo,
    data: dataUserInfo,
    isSuccess: isSuccessUserInfo,
  } = useRdQuery({
    queryKey: ["get-user-info-from-news-chat-room"],
    queryFn: async () => {
      const rdManager = new RdModulesManager();
      const ret = await rdManager
        .get<AppRepository>("AppRepository")
        .chat.user.userInfo();
      return ret;
    },
  });

  const {
    isLoading: isLoadingListUser,
    isSuccess: isSuccessListUser,
    data: dataListUser,
  } = useRdQuery({
    queryKey: ["get-list-user-from-news-chat-room"],
    queryFn: async () => {
      const rdManager = new RdModulesManager();
      const ret = await rdManager
        .get<AppRepository>("AppRepository")
        .chat.user.listFriends();
      return ret;
    },
  });

  useEffect(() => {
    if (refTextMessage.current) {
      let check = false;
      refTextMessage.current.addEventListener("keypress", async (event) => {
        if (
          event.key === "Enter" &&
          !event.shiftKey &&
          refTextMessage.current
        ) {
          event.preventDefault();
          if (refTextMessage.current.value.trim().length > 0 && !check) {
            check = true;
            await submitAllMessage();
            setTimeout(() => {
              check = false;
            }, 500);
          }
        }
      });
    }
  }, [refTextMessage.current]);

  useEffect(() => {
    if (dataUserInfo && isSuccessUserInfo && isSuccessListUser) {
      const rdModule = new RdModulesManager();
      const socket = new WebSocket(
        `${Environment.hostWsGroup}/${Environment.groupId}`,
      );
      socket.binaryType = "arraybuffer";

      socket.addEventListener("open", () => {
        setLoading(false);
      });
      socket.addEventListener("close", () => {
        console.error("socker . isclose");
      });
      socket.addEventListener("error", (e) => {
        console.error("socker is error", e);
      });

      socket.addEventListener("message", (event) => {
        const data = new Uint8Array(event.data as ArrayBuffer);
        const resp = MessageReponse.fromBinary(data);
        try {
          rdModule.get<AppSession>("AppSession").message.next({
            id: resp.id,
            content: resp.content,
            createAt: resp.createAt,
            Group: resp.group,
            receiver: resp.receiver,
            sender: resp.sender,
            type: resp.type.valueOf(),
          });
        } catch (error) {
          console.error(error);
        }
      });

      return () => {
        console.debug("unmount mini app");
        socket.close();
      };
    }
  }, [isSuccessUserInfo, dataUserInfo, isSuccessListUser]);

  async function sendMessageText(text: string) {
    try {
      const rdManage = new RdModulesManager();
      const message = MessageRequest.toBinary(
        MessageRequest.create({
          content: text,
          receiver: "",
          type: MessageType.TEXT,
          group: {
            id: Environment.groupId,
            name: "Trò chuyện 4 phương",
          },
        }),
      );

      rdManage.get<AppRepository>("AppRepository").chat.message.sendToGroup({
        data: message,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function submitAllMessage() {
    if (refTextMessage.current) {
      const _message = refTextMessage?.current?.value?.trim() ?? "";
      if (_message.length !== 0) {
        sendMessageText(_message);
      }
      refTextMessage.current.value = "";
    }
  }

  if (isLoading || isLoadingUserInfo || isLoadingListUser) {
    return <>Đang vào group</>;
  }

  return (
    <div
      className="column"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#FFFFFF",
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        backgroundImage: `url("${imgChatBg}")`,
      }}
    >
      <div
        className="row"
        style={{
          width: "100%",
          padding: "12px",
          justifyItems: "flex-start",
          alignItems: "center",
          color: "#0D1C2E",
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: "600",
          borderBottom: "1px solid gray",
          backgroundColor: "rgba(255, 255, 255, 1)",
        }}
      >
        <span>{"Trò chuyện 4 phương"}</span>
      </div>
      <MessageFrame
        groupMember={(() => {
          const map = new Map<string, string>();
          map.set(dataUserInfo!.id, dataUserInfo!.name);
          dataListUser?.forEach((e) => {
            map.set(e.id, e.name);
          });
          return map;
        })()}
        groupId={Environment.groupId}
        userId={dataUserInfo?.id ?? ""}
      />
      <form
        id={`form-${Environment.groupId}`}
        ref={refFormMessage}
        onSubmit={(e) => {
          e.preventDefault();
          submitAllMessage();
        }}
        className="row"
        style={{
          width: "80%",
          height: "fit-content",
          margin: 0,
          backgroundColor: "rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(5px)",
          border: "none",
          borderRadius: "12px",
        }}
      >
        <textarea
          className="input-message"
          role="textbox"
          rows={5}
          form={`form-${Environment.groupId}`}
          ref={refTextMessage}
          placeholder="Gửi tin nhắn đi"
        />
      </form>
    </div>
  );
}

export default App;
