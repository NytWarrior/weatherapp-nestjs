import { WiNightClear, WiNightPartlyCloudy, WiDaySunnyOvercast, WiFog, WiRaindrop, WiRaindrops, WiRain, WiRainWind } from "react-icons/wi";

export const weatherCodeComponentMap = {
    0: WiNightClear,
    1: WiNightClear,
    2: WiNightPartlyCloudy,
    3: WiDaySunnyOvercast,
    45: WiFog,
    48: WiFog,
    51: WiRaindrop,
    53: WiRaindrops,
    55: WiRain,
    61: WiRain,
    63: WiRain,
    65: WiRainWind,
    80: WiRain,
    81: WiRain,
    82: WiRainWind,
}

export const weatherLabelMap = {
    0: "Clear",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    80: "Light Shower",
    81: "Moderate Shower",
    82: "Heavy Shower",
}
