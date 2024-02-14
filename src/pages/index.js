import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import moment from 'moment';
import { weatherCodeComponentMap, weatherLabelMap } from '@/assets/js/maps';
import { DayWeather, DayWeather2 } from '@/component/weatherformat';
import Link from 'next/link';

export default function Home() {
  const [locationPermission, setLocationPermission] = useState(null);
  const [dailyData, setDailyData] = useState([])
  const [hourlyData, setHourlyData] = useState([])
  const [temp, setTemp] = useState("")

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m,rain,showers,snowfall,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset`
      )

      const data = await response.json();
      const { hourly, daily } = data

      let hourlyDataSet = [];

      // Process hourly data for every 3 hours
      for (let i = 0; i < hourly?.time.length && i < 25; i += 3) {
        hourlyDataSet.push({
          time: hourly?.time[i],
          temperature_2m: hourly?.temperature_2m[i],
          rain: hourly?.rain[i],
          showers: hourly?.showers[i],
          snowfall: hourly?.snowfall[i],
          weathercode: hourly?.weathercode[i],
          windspeed_10m: hourly?.windspeed_10m[i],
        });
      }

      setHourlyData(hourlyDataSet);
      // console.log(hourlyDataSet)

      // Process daily data
      let dailyDataSet = [];
      for (let i = 0; i < Math.min(7, daily?.time.length); i++) {
        dailyDataSet.push({
          time: daily?.time[i],
          temperature_2m_max: daily?.temperature_2m_max[i],
          temperature_2m_min: daily?.temperature_2m_min[i],
          weathercode: daily?.weathercode[i],
          sunrise: daily?.sunrise[i],
          sunset: daily?.sunset[i],
        });
      }

      setDailyData(dailyDataSet);
      setTemp(data.current.temperature_2m);

    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    // Function to get user's location permission
    const askForLocationPermission = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
          setLocationPermission(true);
        },
        () => {
          setLocationPermission(false);
        }
      );
    };



    // console.log(dailyData)

    // Check if geolocation is supported
    if (navigator.geolocation) {
      askForLocationPermission();
    } else {
      setLocationPermission(false);
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Weather App</title>
        <meta name='description' content='Weather App' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {/* Weather Component */}
      {locationPermission === null && <p>Requesting location permission...</p>}
      {locationPermission === false && <p>Location permission denied.</p>}
      {/* {console.log(dailyData)} */}
      {locationPermission === true && (
        <div className="relative overflow-hidden">
          <div className='absolute right-2'>
            <Link href="/search" className="inline-flex text-white bg-pink-500 border-0 py-1 px-2 mx-2 my-1 focus:outline-none hover:bg-pink-600 rounded">Search Location</Link>

          </div>
          <div className="flex flex-col items-center justify-center w-screen min-h-screen text-gray-700 p-10 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200">

            {dailyData.length > 0 && (
              <div className="w-full max-w-screen-sm bg-white p-10 rounded-xl ring-8 ring-white ring-opacity-40">
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="text-6xl font-bold">{temp}°C</span>
                    <span className="font-semibold mt-1 text-gray-500">
                      Based on Your Current Location.
                    </span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-20 h-20 text-white p-2 bg-pink-400 rounded-full" viewBox="0 0 24 24">
                    <path d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"></path>
                  </svg>
                </div>
                <div className="flex justify-between mt-12">
                  {/* Repeat the following block for each time slot */}
                  {/* Example: */}
                  {hourlyData.map((day) => (
                    // <DayWeather key={day.time} date={day.time} temperature={day.temperature_2m} />

                    <DayWeather key={day.time} date={day.time} Icon={weatherCodeComponentMap[day.weathercode]} label={weatherLabelMap[day.weathercode]} temperature={day.temperature_2m} />
                  ))}

                </div>
              </div>
            )}
            <div className="flex flex-col space-y-6 w-full max-w-screen-sm bg-white p-10 mt-10 rounded-xl ring-8 ring-white ring-opacity-40">
              {dailyData.map((day) => (
                <DayWeather2
                  key={day.time}
                  label={weatherLabelMap[day.weathercode]}
                  Icon={weatherCodeComponentMap[day.weathercode]}
                  payload={day}
                />
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
