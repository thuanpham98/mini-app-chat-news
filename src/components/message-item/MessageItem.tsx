import { MessageModel, MessageModelType } from "@/domain/chat";
import dayjs from "dayjs";

export const MessageItem = ({
  message,
  isSender,
  name,
}: {
  message: MessageModel;
  isSender: boolean;
  name: string;
}) => {
  return (
    <div
      className="row"
      style={{
        width: "100%",
        alignItems: "center",
        justifyContent: isSender ? "flex-end" : "flex-start",
      }}
    >
      {message.type.valueOf() === MessageModelType.FILE.valueOf() && (
        <a
          rel="noreferrer"
          target="_blank"
          href={`http://localhost:6969/api/v1/storage/public/image/${message.content}`}
          className="column"
          style={{
            width: "fit-content",
            minWidth: "36px",
            maxWidth: "calc(100% - 84px)",
            textAlign: "start",
            backgroundColor: isSender ? "#FFC0CB" : "#303030",
            color: isSender ? "#212121" : "#FFFFFF",
            padding: "8px",
            borderRadius: "12px",
            whiteSpace: "initial",
            wordBreak: "break-word",
          }}
        >
          {message.content}
        </a>
      )}
      {message.type.valueOf() === MessageModelType.IMAGE.valueOf() && (
        <img
          src={`http://localhost:6969/api/v1/storage/public/image/${message.content}`}
          style={{ width: "320px" }}
        />
      )}
      {message.type.valueOf() === MessageModelType.TEXT.valueOf() && (
        <div
          className="column"
          style={{
            width: "100%",
            minWidth: "36px",
            maxWidth: "calc(100% - 84px)",
            alignItems: isSender ? "flex-end" : "flex-start",
          }}
        >
          <span
            style={{
              color: "#333333",
              fontSize: "16px",
              lineHeight: "24px",
              fontWeight: "600",
            }}
          >
            {name}
          </span>
          <span
            className="column"
            style={{
              width: "fit-content",
              textAlign: "start",
              backgroundColor: isSender ? "#FFC0CB" : "#303030",
              color: isSender ? "#212121" : "#FFFFFF",
              padding: "8px",
              borderRadius: "12px",
              whiteSpace: "initial",
              wordBreak: "break-word",
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: "400",
              alignItems: "flex-start",
            }}
          >
            {message.content}
            <span
              style={{
                color: isSender ? "#212121" : "#FFFFFF",
                fontSize: "10px",
                lineHeight: "12px",
                fontWeight: "400",
              }}
            >
              {dayjs(message.createAt).format("HH:mm - DD/MM/YYYY")}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};
