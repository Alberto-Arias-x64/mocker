import express from "express";
import fs from "fs/promises";
import { version, platform, arch } from "os";
import { exec } from "child_process";
const app = express();
app.use(express.json());
app.disable("x-powered-by");

const files = await fs.readdir("api", { recursive: true });
const filter = files.filter((path) => /.*\..*/gm.test(path));
const routes = filter.map((path) => path.replaceAll("\\", "/"));
app.get("/", (_req, res) => {
  const availableRoutes = {
    message: "Welcome to api Mocker",
    version: "1.0.0",
    os: platform() + " - " + version() + " - " + arch(),
    language: process.env.LANG,
    node: process.version,
    implementation: {},
  };
  routes.forEach(
    (route) =>
      (availableRoutes["implementation"][
        route.replace(/\..*/gm, "").split("/").at(-1)
      ] = route.replace(/\..*/gm, ""))
  );
  res.json(availableRoutes);
});
routes.forEach((route) => {
  app.get(`/${route.replace(/\..*/gm, "")}`, (req, res) =>
    res.sendFile(`${process.cwd()}/api/${route}`)
  );
});
app.get("*", (_req, res) => res.send("Not Implemented"));

app.listen(process.env.PORT, () => {
  console.log(`server listening on http://localhost:${process.env.PORT}`);
  exec(`start "" "http://localhost:${process.env.PORT}"`)
});