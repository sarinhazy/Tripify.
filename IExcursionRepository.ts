import { Excursion } from "../models/Excursion.js";

export interface ExcursionFilter {
  q?: string;            // termo de busca (RF12)
  category?: string;     // filtragem por categoria (RF16)
  near?: string;         // ex.: "Belo Horizonte" (simplificado)
  dateFrom?: string;
  dateTo?: string;
}

export interface IExcursionRepository {
  all(filter?: ExcursionFilter): Promise<Excursion[]>;
  findById(id: string): Promise<Excursion | null>;
  create(exc: Excursion): Promise<Excursion>;
  update(exc: Excursion): Promise<Excursion>;
  delete(id: string): Promise<void>;
}