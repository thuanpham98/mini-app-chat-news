import { IUserRepository } from "@/domain/auth";
import { ConfigurationApiParameters } from "@/infrastructure/chat-api/config";
import { UserControllerApi } from "@/infrastructure/chat-api/UserControllerApi";
import { UserRepository } from "./UserRepository";
import { MessageControllerApi } from "@/infrastructure/chat-api/MessageControllerApi";
import { IMessageRepository } from "@/domain/chat";
import { MessageRepository } from "./MessageRepository";

export const chatConfig: ConfigurationApiParameters = {};

export class ChatHttpClient {
  public readonly user: UserControllerApi;
  public readonly message: MessageControllerApi;

  constructor(params: ConfigurationApiParameters) {
    this.user = new UserControllerApi(params);
    this.message = new MessageControllerApi(params);
  }
}

export class ChatRepository {
  public chatHttpClient: ChatHttpClient;
  public readonly user: IUserRepository;
  public readonly message: IMessageRepository;

  constructor(params: ConfigurationApiParameters) {
    this.chatHttpClient = new ChatHttpClient(params);
    this.user = new UserRepository(this.chatHttpClient);
    this.message = new MessageRepository(this.chatHttpClient);
  }
}
