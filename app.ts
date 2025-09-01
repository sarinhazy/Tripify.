import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import webRoutes from "./routes/web.js";
import apiRoutes from "./routes/api.js";
import { i18nMiddleware } from "./middleware/i18n.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(i18nMiddleware);               // suporte multilíngue (RF08)
app.use(express.static(path.join(__dirname, "../public")));

app.use("/", webRoutes);                // páginas (Views)
app.use("/api", apiRoutes);             // JSON (Controllers → Services → Repos)

export default app;
