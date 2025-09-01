import { Router } from "express";
import { InMemoryExcursionRepository } from "../repositories/InMemoryExcursionRepository.js";
import { ExcursionController } from "../controllers/ExcursionController.js";
import { WeatherService } from "../services/WeatherService.js";
import { RecommendationService } from "../services/RecommendationService.js";
import { BookingController } from "../controllers/BookingController.js";

const repo = new InMemoryExcursionRepository();
const ctrl = new ExcursionController(
  repo,
  new WeatherService(process.env.OPENWEATHER_API_KEY ?? ""),
  new RecommendationService()
);
const book = new BookingController(repo);

const r = Router();
r.get("/excursions", async (req, res) => res.json(await repo.all()));
r.post("/excursions", ctrl.create);
r.put("/excursions/:id", ctrl.update);
r.delete("/excursions/:id", ctrl.delete);

r.post("/excursions/:id/reserve", book.reserve);

export default r;