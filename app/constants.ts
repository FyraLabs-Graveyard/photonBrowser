export const BASE_SKYE_URL =
  process.env.NODE_ENV !== "development"
    ? "photon://ui"
    : "http://localhost:3000";
