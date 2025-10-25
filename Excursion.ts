export type Category = "aventura" | "cultural" | "gastronomica";

export class Excursion {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public location: string,     // cidade/UF
    public dateISO: string,      // 2025-09-10
    public seatsTotal: number,
    public seatsTaken: number,
    public category: Category,
    public companyId: string,
    public images: string[] = []
  ) {}

  get seatsAvailable(): number {
    return Math.max(this.seatsTotal - this.seatsTaken, 0); // RF14
  }

  reserve(qty: number) {
    if (qty <= 0) throw new Error("Quantidade inválida");
    if (this.seatsTaken + qty > this.seatsTotal) throw new Error("Sem vagas suficientes");
    this.seatsTaken += qty;
  }
}