import { IExcursionRepository, ExcursionFilter } from "./IExcursionRepository.js";
import { Excursion } from "../models/Excursion.js";
import crypto from "crypto";

export class InMemoryExcursionRepository implements IExcursionRepository {
  private data: Excursion[] = [];

  async all(filter?: ExcursionFilter): Promise<Excursion[]> {
    let list = [...this.data];

    if (filter?.q) {
      const q = filter.q.toLowerCase();
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
      );
    }
    if (filter?.category) {
      list = list.filter(e => e.category === filter.category);
    }
    if (filter?.near) {
      list = list.filter(e => e.location.toLowerCase().includes(filter.near!.toLowerCase()));
    }
    // (dateFrom/dateTo simplificados)
    return list;
  }

  async findById(id: string) {
    return this.data.find(e => e.id === id) ?? null;
  }

  async create(exc: Excursion) {
    exc.id = crypto.randomUUID();
    this.data.push(exc);
    return exc;
  }

  async update(exc: Excursion) {
    const i = this.data.findIndex(e => e.id === exc.id);
    if (i === -1) throw new Error("Not found");
    this.data[i] = exc;
    return exc;
  }

  async delete(id: string) {
    this.data = this.data.filter(e => e.id !== id);
  }
}