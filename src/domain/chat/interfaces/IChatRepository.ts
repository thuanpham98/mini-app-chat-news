export interface IMessageRepository {
  sendToGroup({ data }: { data: Uint8Array }): Promise<boolean>;
}

