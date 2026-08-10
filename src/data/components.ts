import type { Component, Scenario, YearResult } from "../types";

/** Fixed parameters carried over from the reserve study. */
export const STUDY_DEFAULTS: Scenario = {
  seed: 0,
  annualContribution: 0,
  contributionIncreasePct: 4,
  interestRatePct: 0,
  inflationPct: 2,
  horizonEndYear: 2046,
};

/** The base year from which inflation is counted and the projection begins. */
export const BASE_YEAR = 2027;

/**
 * The 25 components, derived from the reserve study (June 18, 2026) and corrected with
 * family-ground-truth knowledge of the compound.
 */
export const COMPONENTS: Component[] = [
  { id: 1285, description: "Boathouse - Roof, Replacement", building: "Boathouse", category: "Roofing", placedInServiceYear: 2005, usefulLife: 30, adjustment: 0, replacementYear: 2035, actualCost: 28000 },
  { id: 1276, description: "Cabin - Roof, Replacement", building: "Cabin", category: "Roofing", placedInServiceYear: 2005, usefulLife: 30, adjustment: 0, replacementYear: 2035, actualCost: 9000 },
  { id: 1279, description: "Cottage - Roof, Replacement", building: "Cottage", category: "Roofing", placedInServiceYear: 2005, usefulLife: 30, adjustment: 0, replacementYear: 2035, actualCost: 9000 },
  { id: 1286, description: "Garage - Roof, Replacement", building: "Garage", category: "Roofing", placedInServiceYear: 2001, usefulLife: 50, adjustment: 0, replacementYear: 2051, actualCost: 25000 },
  { id: 1284, description: "Icehouse - Roof, Replacement", building: "Icehouse", category: "Roofing", placedInServiceYear: 2005, usefulLife: 30, adjustment: 0, replacementYear: 2028, actualCost: 3000 },
  { id: 1271, description: "Main House - Roof, Replacement", building: "Main House", category: "Roofing", placedInServiceYear: 2005, usefulLife: 30, adjustment: 0, replacementYear: 2028, actualCost: 36000 },
  { id: 1287, description: "Studio - Roof, Replacement", building: "Studio", category: "Roofing", placedInServiceYear: 2005, usefulLife: 30, adjustment: 0, replacementYear: 2035, actualCost: 4000 },
  { id: 1288, description: "Zing House - Roof, Replacement", building: "Zing House", category: "Roofing", placedInServiceYear: 2023, usefulLife: 30, adjustment: 0, replacementYear: 2053, actualCost: 4000 },
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
  { id: 1272, description: "Main House - Siding, Replacement", building: "Main House", category: "Building Components", placedInServiceYear: 2022, usefulLife: 40, adjustment: 0, replacementYear: 2062, actualCost: 58000 },
  { id: 1261, description: "Main House - Window/Door, Replacements", building: "Main House", category: "Building Components", placedInServiceYear: 2027, usefulLife: 40, adjustment: 40, replacementYear: 2067, actualCost: 30000 },
  { id: 1265, description: "Septic System - Replacements", building: "Septic System", category: "Grounds Components", placedInServiceYear: 2015, usefulLife: 30, adjustment: 0, replacementYear: 2045, actualCost: 50000 },
  { id: 1289, description: "Dock - Ice Damage Repair", building: "Dock", category: "Grounds Components", placedInServiceYear: 2022, usefulLife: 10, adjustment: 0, replacementYear: 2032, actualCost: 50000 },
  { id: 1290, description: "Driveway - Maintenance/Repair", building: "Driveway", category: "Grounds Components", placedInServiceYear: 2022, usefulLife: 5, adjustment: 0, replacementYear: 2027, actualCost: 5000 },
  { id: 1291, description: "Forestry - Tree/Trail Maintenance", building: "Forestry", category: "Grounds Components", placedInServiceYear: 2022, usefulLife: 5, adjustment: 0, replacementYear: 2027, actualCost: 10000 },
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
