import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RdAppExtends, RdModulesManager } from "@radts/reactjs";
import { AppRepository } from "./application/services/app-repository";
import { AppSession } from "./application/services/app-session";

const mount = (mountPoint: HTMLElement, initPathName: string) => {
  // console.log(mountPoint);
  // console.log(initPathName);
  const rdManager = new RdModulesManager();
  rdManager
    .use(new AppRepository("http://localhost:6969"))
    .use(new AppSession());
  const root = ReactDOM.createRoot(mountPoint);
  root.render(
    <Suspense>
      <RdAppExtends appProps={{}}>
        <App />
      </RdAppExtends>
    </Suspense>,
  );
  return () => queueMicrotask(() => root.unmount());
};

export { mount };
