const initHome = () => {
  const paths = [
    {
      label: "Basic Shapes",
      path: "basic-shapes",
    },
    {
      label: "Circle dash",
      path: "circle-dash",
    },
    {
      label: "Gravity",
      path: "gravity",
    },
    {
      label: "Collision",
      path: "collision",
    },
  ];
  document.body.classList.add("home");
  const h1 = document.createElement("h1");
  const div = document.createElement("div");
  const a = document.createElement("a");
  h1.textContent = "Canvas Practise";
  div.classList.add("wrapper");
  let innerLinks = "";
  paths.forEach((path) => {
    innerLinks += `<a href="/?page=${path.path}">${path.label}</a>`;
  });

  div.innerHTML = innerLinks;

  document.body.appendChild(h1);
  document.body.appendChild(div);
};

const importScript = (path) => {
  const script = document.createElement("script");

  script.src = `./${path}.js`;
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  document.body.appendChild(script);
};

window.onload = () => {
  const query = window.location.search.split("?").pop();
  const params = new URLSearchParams(query);
  const path = params.get("page");

  switch (path) {
    case "basic-shapes":
    case "circle-dash":
    case "gravity":
    case "collision":
      importScript(path);
      break;
    default:
      initHome();
  }
};
