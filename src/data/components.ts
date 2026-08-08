import type { Component, Scenario, YearResult } from "../types";

/** The Michael Callahan & Associates study's fixed parameters. */
export const STUDY_DEFAULTS: Scenario = {
  seed: 0,
  annualContribution: 0,
  contributionIncreasePct: 4,
  interestRatePct: 0,
  inflationPct: 2,
  horizonEndYear: 2046,
};

/** The base year from which inflation is counted and the study projection begins. */
export const BASE_YEAR = 2027;

/** The 22 components baked from the reserve study (Michael Callahan & Associates, June 18 2026). */
export const COMPONENTS: Component[] = [
  { id: 1285, description: "Boathouse - Roof, Replacement", building: "Boathouse", category: "Roofing", placedInServiceYear: 2005, usefulLife: 30, adjustment: 0, replacementYear: 2035, actualCost: 28000 },
  { id: 1276, description: "Cabin - Roof, Replacement", building: "Cabin", category: "Roofing", placedInServiceYear: 2005, usefulLife: 30, adjustment: 0, replacementYear: 2035, actualCost: 9000 },
  { id: 1279, description: "Cottage - Roof, Replacement", building: "Cottage", category: "Roofing", placedInServiceYear: 2005, usefulLife: 30, adjustment: 0, replacementYear: 2035, actualCost: 9000 },
  { id: 1286, description: "Garage - Roof, Replacement", building: "Garage", category: "Roofing", placedInServiceYear: 2001, usefulLife: 50, adjustment: 0, replacementYear: 2051, actualCost: 25000 },
  { id: 1284, description: "Icehouse - Roof, Replacement", building: "Icehouse", category: "Roofing", placedInServiceYear: 2005, usefulLife: 30, adjustment: 0, replacementYear: 2035, actualCost: 3000 },
  { id: 1271, description: "Main House - Roof, Replacement", building: "Main House", category: "Roofing", placedInServiceYear: 2005, usefulLife: 30, adjustment: 0, replacementYear: 2035, actualCost: 36000 },
  { id: 1287, description: "Studio - Roof, Replacement", building: "Studio", category: "Roofing", placedInServiceYear: 2005, usefulLife: 30, adjustment: 0, replacementYear: 2035, actualCost: 4000 },
  { id: 1288, description: "Zing House - Roof, Replacement", building: "Zing House", category: "Roofing", placedInServiceYear: 2005, usefulLife: 30, adjustment: 0, replacementYear: 2035, actualCost: 4000 },
  { id: 1274, description: "Cabin - Interior Renovations", building: "Cabin", category: "Interior Furnishings", placedInServiceYear: 1985, usefulLife: 30, adjustment: 13, replacementYear: 2028, actualCost: 10000 },
  { id: 1280, description: "Cottage - Interior Renovations", building: "Cottage", category: "Interior Furnishings", placedInServiceYear: 1985, usefulLife: 30, adjustment: 14, replacementYear: 2029, actualCost: 10000 },
  { id: 1267, description: "Main House - First Floor, Renovations", building: "Main House", category: "Interior Furnishings", placedInServiceYear: 2027, usefulLife: 30, adjustment: 30, replacementYear: 2057, actualCost: 50000 },
  { id: 1275, description: "Cabin - Hot Water Heater, Replacement", building: "Cabin", category: "Equipment", placedInServiceYear: 2010, usefulLife: 18, adjustment: 0, replacementYear: 2028, actualCost: 2800 },
  { id: 1281, description: "Cottage - Hot Water Heater, Replacement", building: "Cottage", category: "Equipment", placedInServiceYear: 2011, usefulLife: 18, adjustment: 0, replacementYear: 2029, actualCost: 2800 },
  { id: 1273, description: "Main House - Boiler", building: "Main House", category: "Equipment", placedInServiceYear: 2002, usefulLife: 30, adjustment: 0, replacementYear: 2032, actualCost: 9800 },
  { id: 1270, description: "Main House - Hot Water Heater, Replacement", building: "Main House", category: "Equipment", placedInServiceYear: 2000, usefulLife: 18, adjustment: 0, replacementYear: 2027, actualCost: 2800 },
  { id: 1277, description: "Cabin - Siding, Replacement", building: "Cabin", category: "Building Components", placedInServiceYear: 1985, usefulLife: 40, adjustment: 3, replacementYear: 2028, actualCost: 18000 },
  { id: 1278, description: "Cabin - Window/Door, Replacements", building: "Cabin", category: "Building Components", placedInServiceYear: 1985, usefulLife: 40, adjustment: 3, replacementYear: 2028, actualCost: 6000 },
  { id: 1283, description: "Cottage - Siding, Replacement", building: "Cottage", category: "Building Components", placedInServiceYear: 1985, usefulLife: 40, adjustment: 4, replacementYear: 2029, actualCost: 18000 },
  { id: 1282, description: "Cottage - Window/Door, Replacements", building: "Cottage", category: "Building Components", placedInServiceYear: 1985, usefulLife: 40, adjustment: 4, replacementYear: 2029, actualCost: 6000 },
  { id: 1272, description: "Main House - Siding, Replacement", building: "Main House", category: "Building Components", placedInServiceYear: 1985, usefulLife: 40, adjustment: 0, replacementYear: 2027, actualCost: 58000 },
  { id: 1261, description: "Main House - Window/Door, Replacements", building: "Main House", category: "Building Components", placedInServiceYear: 2027, usefulLife: 40, adjustment: 40, replacementYear: 2067, actualCost: 30000 },
  { id: 1265, description: "Septic System - Replacements", building: "Septic System", category: "Grounds Components", placedInServiceYear: 2015, usefulLife: 30, adjustment: 0, replacementYear: 2045, actualCost: 50000 },
];

/**
 * The published projection from the study (2027–2046). Used as a gold-standard test fixture:
 * the default scenario MUST reproduce these numbers.
 */
export const PUBLISHED_FIXTURES: {
  year: number;
  expenditures: number;
  endingReserves: number;
  fullyFunded: number;
  percentFunded: number;
}[] = [
  { year: 2027, expenditures: 60800, endingReserves: -60800, fullyFunded: 235055, percentFunded: -0.26 },
  { year: 2028, expenditures: 37536, endingReserves: -98336, fullyFunded: 212314, percentFunded: -0.46 },
  { year: 2029, expenditures: 38287, endingReserves: -136623, fullyFunded: 188741, percentFunded: -0.72 },
  { year: 2030, expenditures: 0, endingReserves: -136623, fullyFunded: 203974, percentFunded: -0.67 },
  { year: 2031, expenditures: 0, endingReserves: -136623, fullyFunded: 219740, percentFunded: -0.62 },
  { year: 2032, expenditures: 10820, endingReserves: -147443, fullyFunded: 225019, percentFunded: -0.66 },
  { year: 2033, expenditures: 0, endingReserves: -147443, fullyFunded: 241678, percentFunded: -0.61 },
  { year: 2034, expenditures: 0, endingReserves: -147443, fullyFunded: 258913, percentFunded: -0.57 },
  { year: 2035, expenditures: 108964, endingReserves: -256407, fullyFunded: 165598, percentFunded: -1.55 },
  { year: 2036, expenditures: 0, endingReserves: -256407, fullyFunded: 181813, percentFunded: -1.41 },
  { year: 2037, expenditures: 0, endingReserves: -256407, fullyFunded: 198610, percentFunded: -1.29 },
  { year: 2038, expenditures: 0, endingReserves: -256407, fullyFunded: 216007, percentFunded: -1.19 },
  { year: 2039, expenditures: 0, endingReserves: -256407, fullyFunded: 234020, percentFunded: -1.1 },
  { year: 2040, expenditures: 0, endingReserves: -256407, fullyFunded: 252667, percentFunded: -1.01 },
  { year: 2041, expenditures: 0, endingReserves: -256407, fullyFunded: 271966, percentFunded: -0.94 },
  { year: 2042, expenditures: 0, endingReserves: -256407, fullyFunded: 291937, percentFunded: -0.88 },
  { year: 2043, expenditures: 0, endingReserves: -256407, fullyFunded: 312597, percentFunded: -0.82 },
  { year: 2044, expenditures: 0, endingReserves: -256407, fullyFunded: 333967, percentFunded: -0.77 },
  { year: 2045, expenditures: 75411, endingReserves: -331818, fullyFunded: 279147, percentFunded: -1.19 },
  { year: 2046, expenditures: 4079, endingReserves: -335898, fullyFunded: 296298, percentFunded: -1.13 },
];

/** Helper: a YearResult-shaped zero for an empty category map. */
export function emptyCategoryMap(): YearResult["expendituresByCategory"] {
  return {
    Roofing: 0,
    "Interior Furnishings": 0,
    Equipment: 0,
    "Building Components": 0,
    "Grounds Components": 0,
  };
}
