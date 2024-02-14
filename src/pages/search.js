import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export default function SearchBox() {
    const [value, setValue] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const debouncedValue = useDebounce(value, 500);
    const [cities, setCities] = useState([]);
    const [city, setCity] = useState("");
    const [toggle, setToggle] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (debouncedValue === "") {
            setShow(false);
            return;
        }

        setLoading(true);

        fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${debouncedValue}`)
            .then((res) => res.json())
            .then((data) => {
                if (data?.results.length === 0) {
                    setShow(false);
                    setCities([]);
                    setLoading(false);
                    return;
                }

                setCities(data.results);
                setShow(true);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, [debouncedValue]);

    function handleClickEvent(city) {
        // handleClick(city);
        // console.log(city)
        setCity(city.name);
        setShow(false);
        setToggle(true);
        router.push({
            pathname: '/detail', // replace this with the actual path of your previous page
            query: {
                selectedCity: city.name,
                latitude: city.latitude,
                longitude: city.longitude,
            },
        });
    }

    return (
        <div className="relative overflow-hidden">
            <div className="flex flex-col items-center justify-center w-screen min-h-screen text-black-700 p-10 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200">
                <h1 className="text-4xl font-bold mb-6 text-gray-600">Search for Your Location</h1>

                {!toggle ? (
                    <input
                        className="p-3 w-full rounded-md bg-transparent border border-black-400 focus:border-black-200 outline-none shadow shadow-black-300 text-black-600 placeholder:text-black-800"
                        placeholder="Search for city"
                        onInput={(e) => setValue(e.target.value)}
                        value={value}
                    />
                ) : (
                    <div
                        onClick={() => setToggle(false)}
                        className="p-3 w-full rounded-md bg-transparent border border-black-400 focus:border-black-200 outline-none shadow shadow-black-300 text-black-50 placeholder:text-black-400"
                    >
                        {city}
                    </div>
                )}
                <ul className="w-full bg-pink-300 divide-y divide-black-500 rounded-md">
                    {loading && <li className="p-3 text-black-50">Loading...</li>}
                    {show &&
                        cities.map((city) => (
                            <li
                                onClick={() => handleClickEvent(city)}
                                className="p-3 hover:bg-pink-400 transition-all ease-in-out duration-100 text-black-50"
                                key={city.id}
                            >
                                {city.name}, {city.country}
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}
