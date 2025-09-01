import { Request, Response } from "express";
import { IExcursionRepository } from "../repositories/IExcursionRepository.js";

export class BookingController {
  constructor(private excRepo: IExcursionRepository) {}

  reserve = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { qty } = req.body; // quantidade de vagas
    const e = await this.excRepo.findById(id);
    if (!e) return res.status(404).send("Not found");
    try {
      e.reserve(Number(qty));
      await this.excRepo.update(e);
      res.json({ success: true, seatsAvailable: e.seatsAvailable });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
}