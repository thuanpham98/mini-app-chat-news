import { AxiosResponse } from "axios";
import { InternalAxiosRequestConfig } from "axios";
import { ErrorApi } from "../models/ErrorCustomModel";

export function onResponse(res: AxiosResponse) {
  return Promise.resolve(res);
}

export function onRequest(req: InternalAxiosRequestConfig) {
  return Promise.resolve(req);
}
export async function onError(e: any) {
  console.error(">>>ERROR");
  console.error(e);

  return Promise.reject(
    new ErrorApi({
      code: e.response.data.data.code,
      message: e.response.data.data.message,
    }),
  );
}
