import { WiSunrise, WiSunset } from 'react-icons/wi';
import moment from 'moment';

export function DayWeather({ Icon, label, temperature, date }) {

    return (
        <div className="flex flex-col items-center">
            <span className="font-semibold text-lg">{temperature}°C</span>
            {Icon && <Icon size={48} color="text-gray-490" />}
            <span className="font-semibold mt-1 text-sm">{moment(date).format("HH:mm")}</span>
            {/* <span className="text-xs font-semibold text-gray-400">AM</span> */}
        </div >

    )
}

export function DayWeather2({ Icon, label, payload }) {
    return (
        <div className="flex justify-between items-center">
            <span className="font-semibold text-lg w-1/4">
                {moment(payload.time).format("DD-MM-YYYY")}
            </span>
            <div className="flex items-center justify-end w-1/4 pr-10">
                <span className="flex items-center space-x-1 text-black-50">
                    <WiSunrise size={24} color="text-gray-400" />
                    <span>{moment(payload.sunrise).format("HH:mm")}</span>
                    <WiSunset size={24} color="text-gray-400" />

                    <span>{moment(payload.sunset).format("HH:mm")}</span>
                </span>
            </div>
            {Icon && <Icon size={24} color="text-gray-400" />}
            <span>{label}</span>
            <span className="font-semibold text-lg w-1/4 text-right">
                {payload.temperature_2m_min} / {payload.temperature_2m_max} °C
            </span>
        </div>
    );
}