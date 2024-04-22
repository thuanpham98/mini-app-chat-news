import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RdAppExtends, RdModulesManager } from "@radts/reactjs";
import { AppRepository } from "./application/services/app-repository";
import { AppSession } from "./application/services/app-session";
import { Environment } from "./application/services/environment";

const mount = (mountPoint: HTMLElement, initPathName: string) => {
  const rdManager = new RdModulesManager();
  rdManager.use(new AppRepository(Environment.hostAPI)).use(new AppSession());
  console.log(Environment);
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
