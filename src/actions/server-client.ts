/** @format */

import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { getTeamCookie } from "./team";

const VERSION_PREFIX = "/api/v1";

export const serverApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + VERSION_PREFIX,
});

serverApiClient.interceptors.request.use(async (config) => {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) return config;

  config.headers.Authorization = `Bearer ${token}`;

  const teamId = await getTeamCookie();

  if (teamId) config.headers["X-Team-ID"] = teamId;

  return config;
});
