import { Request, Response } from "express";
import { IExcursionRepository } from "../repositories/IExcursionRepository.js";
import { Excursion } from "../models/Excursion.js";
import { WeatherService } from "../services/WeatherService.js";
import { RecommendationService } from "../services/RecommendationService.js";

export class ExcursionController {
  constructor(
    private repo: IExcursionRepository,
    private weather: WeatherService,
    private reco: RecommendationService
  ) {}

  // View: Home do cliente (lista + busca + categorias)
  home = async (req: Request, res: Response) => {
    const { q, category, near } = req.query as any;
    const list = await this.repo.all({ q, category, near });
    const recommended = this.reco.recommend(list, 6);
    res.render("home", { excursions: list, recommended });
  };

  // View: Detalhe da excursão (clima + vagas)
  detail = async (req: Request, res: Response) => {
    const e = await this.repo.findById(req.params.id);
    if (!e) return res.status(404).send("Not found");
    const w = await this.weather.currentByCity(e.location, res.locals.lang);
    res.render("excursionDetail", { e, weather: w });
  };

  // Painel empresa
  dashboard = async (req: Request, res: Response) => {
    const list = await this.repo.all();
    res.render("companyDashboard", { excursions: list });
  };

  // API: criar/atualizar/excluir (Repository pattern)
  create = async (req: Request, res: Response) => {
    const { title, description, location, dateISO, seatsTotal, category, companyId, images } = req.body;
    const exc = new Excursion(
      "", title, description, location, dateISO, Number(seatsTotal), 0, category, companyId, images ?? []
    );
    const created = await this.repo.create(exc);
    res.status(201).json(created);
  };

  update = async (req: Request, res: Response) => {
    const current = await this.repo.findById(req.params.id);
    if (!current) return res.status(404).send("Not found");
    Object.assign(current, req.body);
    const updated = await this.repo.update(current);
    res.json(updated);
  };

  delete = async (req: Request, res: Response) => {
    await this.repo.delete(req.params.id);
    res.status(204).send();
  };
}