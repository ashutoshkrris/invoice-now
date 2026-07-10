import fs from "fs";
import { countries, currencies } from "country-data";

const COUNTRIES_LIST_FILE = "./src/constants/countries.js";
const BLOCKED_CODES = new Set(["AN", "CS", "SU", "YU", "NT", "FX", "ZR"]);

const countryList = countries.all
  .filter(
    (c) =>
      c.alpha2 &&
      c.currencies &&
      c.currencies.length > 0 &&
      c.status === "assigned" &&
      !BLOCKED_CODES.has(c.alpha2)
  )
  .reduce((acc, c) => {
    if (acc.some((existing) => existing.code === c.alpha2)) {
      return acc;
    }

    const primaryCurrencyCode = c.currencies[0];
    const currencyInfo = currencies[primaryCurrencyCode];
    const symbol = currencyInfo?.symbol || primaryCurrencyCode;

    acc.push({
      code: c.alpha2,
      country: c.name,
      name: `${c.name} (${symbol})`,
      currency: primaryCurrencyCode,
      symbol,
    });

    return acc;
  }, [])
  .sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync(
  COUNTRIES_LIST_FILE,
  `export const COUNTRIES = ${JSON.stringify(countryList, null, 2)};\n`,
  "utf8"
);

console.log(`countries.js generated and saved in ${COUNTRIES_LIST_FILE}!`);
