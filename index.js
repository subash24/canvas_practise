const initHome = () => {
  let link = document.createElement("link");
  link.href = "./index.css";
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);
  const h1 = document.createElement("h1");
  const a = document.createElement("a");
  h1.textContent = "Canvas Practise";
  a.href = "/?page=circle-dash";
  a.textContent = "Circle Dash";
  document.body.appendChild(h1);
  document.body.appendChild(a);
};

const initCircleDash = () => {
  const script = document.createElement("script");
  script.src = "./circle-dash.js";
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  document.body.appendChild(script);
};

window.onload = () => {
  const query = window.location.search.split("?").pop();
  const params = new URLSearchParams(query);
  switch (params.get("page")) {
    case "circle-dash":
      initCircleDash();
      break;
    default:
      initHome();
  }
};
