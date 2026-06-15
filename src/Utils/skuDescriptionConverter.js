export const removeSKU = (str = "") =>
  str.includes("-") ? str.slice(str.indexOf("-") + 1).trim() : "";

export const removeDescription = (str = "") =>
  str.split("-")[0]?.trim() || "";
