import "./index.css";

import("./bootstrap").then(({ mount }) => {
  const localRoot = document.getElementById("local-mini-app");

  mount(localRoot!, "/");
});
