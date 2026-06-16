/** @format */

import axios from "axios";

const VERSION_PREFIX = "/api/v1";

export const serverApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + VERSION_PREFIX,
});
