const latest = "https://cxrtnc.leaningtech.com/LATEST.txt";
const fallback = "https://cxrtnc.leaningtech.com/1.0.0/cx.js";

export const getLatestCheerpxScriptUrl = async () => {
  const response = await fetch(latest);
  if (!response.ok) return fallback;
  const url = await response.text().catch(() => fallback);
  return url.trim();
};
