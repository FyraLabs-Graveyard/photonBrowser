export const BASE_SKYE_URL =
  process.env.NODE_ENV !== "development"
    ? "skye://ui"
    : "http://localhost:3000";
