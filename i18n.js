import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Request, Response, NextFunction } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesPath = path.join(__dirname, "../../locales");

function load(lang: string) {
  const file = path.join(localesPath, `${lang}.json`);
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf-8"));
  return JSON.parse(fs.readFileSync(path.join(localesPath, "pt.json"), "utf-8"));
}

export function i18nMiddleware(req: Request, res: Response, next: NextFunction) {
  const lang = (req.query.lang as string) || "pt";
  const dict = load(lang);
  res.locals.t = (key: string) => dict[key] ?? key;
  res.locals.lang = lang;
  next();
}