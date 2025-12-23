export type OpenWeatherBase = {
    dt: number;
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
        pressure: number;
    };
    weather: Array<{
        description: string;
        icon: string;
    }>;
    wind: {
        speed: number;
        deg: number;
    };
    clouds: {
        all: number;
    };
};

export type OpenWeatherCurrentResponse = OpenWeatherBase & {
    name: string;
    sys: { country: string };
};

export type OpenWeatherForecastResponse = OpenWeatherBase & {
    city: { name: string; country: string };
    list: Array<OpenWeatherBase & { dt_txt: string; pop?: number }>;
};
