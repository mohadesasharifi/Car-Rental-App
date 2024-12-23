// apiConfig.ts

import {ApiConfig} from "../types/Vehicles"

const getApiConfig = (): ApiConfig => {
    return {
        apiPath: 'http://localhost:80/assignment/vehicles/vehicles_api.php'
    };
};

export default getApiConfig;
