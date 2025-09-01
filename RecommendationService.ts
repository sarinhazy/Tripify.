import { Excursion } from "../models/Excursion.js";

export class RecommendationService {
  recommend(list: Excursion[], limit = 6) {
    // Heurística simples: mais vagas ocupadas (popularidade) + data mais próxima
    return list
      .sort((a, b) => {
        const popB = b.seatsTaken - a.seatsTaken;
        if (popB !== 0) return popB;
        return new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime();
      })
      .slice(0, limit);
  }
}