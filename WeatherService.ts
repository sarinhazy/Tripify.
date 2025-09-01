import axios from "axios";

export class WeatherService {
  constructor(private apiKey: string) {}

  async currentByCity(city: string, lang = "pt") {
    if (!this.apiKey) return null;
    try {
      const res = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: { q: city, appid: this.apiKey, units: "metric", lang }
      });
      const w = res.data;
      return {
        description: w.weather?.[0]?.description ?? "",
        temp: Math.round(w.main?.temp ?? 0),
        icon: w.weather?.[0]?.icon ?? "01d"
      };
    } catch {
      return null;
    }
  }
}