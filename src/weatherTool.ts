import fetch from "node-fetch";

export interface WeatherParams {
  city: string;
}

export interface WeatherResult {
  city: string;
  temperature: number;
  description: string;
}

export async function getWeather(params: WeatherParams): Promise<WeatherResult> {
  const apiKey = process.env.OPENWEATHER_KEY;
  if (!apiKey) {
    throw new Error("OPENWEATHER_KEY fehlt in .env");
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    params.city
  )}&appid=${apiKey}&units=metric&lang=de`;

  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`API-Fehler: ${resp.statusText}`);
  }

  const data: any = await resp.json();

  return {
    city: data.name,
    temperature: data.main.temp,
    description: data.weather[0].description
  };
}