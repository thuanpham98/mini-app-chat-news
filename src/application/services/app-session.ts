import { RdModule } from "@radts/reactjs";
import { BehaviorSubject } from "rxjs";
import { LoginStatus } from "../models/LoginStatus";
import { MessageModel } from "@/domain/chat";

export class AppSession extends RdModule {
  public key: symbol;
  public message: BehaviorSubject<MessageModel | null>;

  constructor() {
    super();
    this.key = Symbol("AppSession");
    this.message = new BehaviorSubject<MessageModel | null>(null);
  }
  getName(): string {
    return this.key.description ?? "AppSession";
  }

  public getClassName(): string {
    return "AppSession";
  }

  public closeAll() {
    this.message.complete();
  }
}
