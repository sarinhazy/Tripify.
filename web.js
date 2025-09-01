import { Router } from "express";
import { InMemoryExcursionRepository } from "../repositories/InMemoryExcursionRepository.js";
import { ExcursionController } from "../controllers/ExcursionController.js";
import { WeatherService } from "../services/WeatherService.js";
import { RecommendationService } from "../services/RecommendationService.js";

const repo = new InMemoryExcursionRepository();
const weather = new WeatherService(process.env.OPENWEATHER_API_KEY ?? "");
const reco = new RecommendationService();
const ctrl = new ExcursionController(repo, weather, reco);

// seed simples (poderia vir do BD)
import { Excursion } from "../models/Excursion.js";
repo.create(new Excursion("", "Trilha na Serra", "Caminhada leve", "Belo Horizonte", "2025-09-20", 20, 5, "aventura", "c1", []));
repo.create(new Excursion("", "Centro Histórico", "Tour guiado", "Salvador", "2025-10-05", 30, 10, "cultural", "c2", []));
repo.create(new Excursion("", "Rota Gastronômica", "Sabores locais", "São Paulo", "2025-11-12", 15, 2, "gastronomica", "c3", []));

const r = Router();

r.get("/", ctrl.home);
r.get("/excursions/:id", ctrl.detail);
r.get("/empresa", ctrl.dashboard);

export default r;