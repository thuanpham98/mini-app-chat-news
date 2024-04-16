import { AppSession } from "@/application/services/app-session";
import { MessageModel } from "@/domain/chat";
import { RdModulesManager } from "@radts/reactjs";
import React, { useEffect, useState } from "react";
import { List } from "immutable";
import { MessageItem } from "../message-item/MessageItem";

interface MessageFrameProps {
  userId: string;
  groupId: string;
  groupMember: Map<string, string>;
}

const MessageFrame = React.memo(
  ({ groupId, userId, groupMember }: MessageFrameProps) => {
    console.debug("chat reset");
    const [state, setState] =
      useState<List<MessageModel>>(List<MessageModel>());

    useEffect(() => {
      let currentMessage: List<MessageModel> = List<MessageModel>();
      const rdManager = new RdModulesManager();
      rdManager.get<AppSession>("AppSession").message.subscribe((mes) => {
        if (mes && mes.Group?.id === groupId) {
          currentMessage = currentMessage.push(mes);
          setState(currentMessage);
        }
      });
    }, []);

    return (
      <div
        key={groupId}
        className="column"
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "column-reverse",
          overflowY: "auto",
        }}
      >
        <div
          className="column"
          style={{
            height: "fit-content",
            gap: "4px",
            padding: "8px",
            width: "100%",
          }}
        >
          {state.map((mess) => {
            return (
              <MessageItem
                isSender={mess.sender === userId}
                message={mess}
                key={mess.id}
                name={groupMember.get(mess.sender) ?? ""}
              />
            );
          })}
        </div>
      </div>
    );
  },
  () => {
    return true;
  },
);

MessageFrame.displayName = "MessageFrame";

export default MessageFrame;
