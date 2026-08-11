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
 * The full component set, a total replacement of the prior fixtures sourced from the
 * Timberlost Maintenance Plan (June 18, 2026 study data). Each row is taken
 * directly from the plan's "Today's Cost / Replacement Cycle / Remaining Life /
 * Scheduled Replacement" columns. `placedInServiceYear` is derived as
 * `replacementYear - usefulLife`, so each component sits at the end of its
 * useful life just before replacement.
 */
export const COMPONENTS: Component[] = [
  // Main House
  { id: 1273, description: "Main House - Boiler/Furnace", building: "Main House", category: "Equipment", placedInServiceYear: 2002, usefulLife: 30, adjustment: 0, replacementYear: 2032, actualCost: 9800 },
  { id: 1267, description: "Main House - First Floor, Renovations", building: "Main House", category: "Interior Furnishings", placedInServiceYear: 2027, usefulLife: 30, adjustment: 0, replacementYear: 2057, actualCost: 50000 },
  { id: 1270, description: "Main House - Hot Water Heater, Replacement", building: "Main House", category: "Equipment", placedInServiceYear: 2009, usefulLife: 18, adjustment: 0, replacementYear: 2027, actualCost: 2800 },
  { id: 1271, description: "Main House - Roof, Replacement", building: "Main House", category: "Roofing", placedInServiceYear: 1998, usefulLife: 30, adjustment: 0, replacementYear: 2028, actualCost: 36000 },
  { id: 1272, description: "Main House - Siding, Replacement", building: "Main House", category: "Building Components", placedInServiceYear: 2022, usefulLife: 40, adjustment: 0, replacementYear: 2062, actualCost: 58000 },
  { id: 1261, description: "Main House - Window/Door, Replacements", building: "Main House", category: "Building Components", placedInServiceYear: 2027, usefulLife: 40, adjustment: 0, replacementYear: 2067, actualCost: 30000 },
  { id: 1292, description: "Main House - Exterior Paint", building: "Main House", category: "Building Components", placedInServiceYear: 2025, usefulLife: 5, adjustment: 0, replacementYear: 2030, actualCost: 12500 },
  { id: 1293, description: "Main House - Chimney Repair", building: "Main House", category: "Building Components", placedInServiceYear: 2002, usefulLife: 30, adjustment: 0, replacementYear: 2032, actualCost: 20000 },
  { id: 1294, description: "Main House - Well System Repair", building: "Main House", category: "Equipment", placedInServiceYear: 2012, usefulLife: 30, adjustment: 0, replacementYear: 2042, actualCost: 5000 },
  // Cabin
  { id: 1275, description: "Cabin - Hot Water Heater, Replacement", building: "Cabin", category: "Equipment", placedInServiceYear: 2010, usefulLife: 18, adjustment: 0, replacementYear: 2028, actualCost: 2800 },
  { id: 1274, description: "Cabin - Interior Renovations", building: "Cabin", category: "Interior Furnishings", placedInServiceYear: 1998, usefulLife: 30, adjustment: 0, replacementYear: 2028, actualCost: 1000 },
  { id: 1276, description: "Cabin - Roof, Replacement", building: "Cabin", category: "Roofing", placedInServiceYear: 2005, usefulLife: 30, adjustment: 0, replacementYear: 2035, actualCost: 9000 },
  { id: 1277, description: "Cabin - Siding, Replacement", building: "Cabin", category: "Building Components", placedInServiceYear: 1988, usefulLife: 40, adjustment: 0, replacementYear: 2028, actualCost: 18000 },
  { id: 1278, description: "Cabin - Window/Door, Replacements", building: "Cabin", category: "Building Components", placedInServiceYear: 1988, usefulLife: 40, adjustment: 0, replacementYear: 2028, actualCost: 6000 },
  { id: 1295, description: "Cabin - Exterior Paint", building: "Cabin", category: "Building Components", placedInServiceYear: 2022, usefulLife: 5, adjustment: 0, replacementYear: 2027, actualCost: 6500 },
  { id: 1296, description: "Cabin - Chimney Repair", building: "Cabin", category: "Building Components", placedInServiceYear: 1999, usefulLife: 30, adjustment: 0, replacementYear: 2029, actualCost: 10000 },
  // Cottage
  { id: 1281, description: "Cottage - Hot Water Heater, Replacement", building: "Cottage", category: "Equipment", placedInServiceYear: 2010, usefulLife: 18, adjustment: 0, replacementYear: 2028, actualCost: 2800 },
  { id: 1280, description: "Cottage - Interior Renovations", building: "Cottage", category: "Interior Furnishings", placedInServiceYear: 1999, usefulLife: 30, adjustment: 0, replacementYear: 2029, actualCost: 1000 },
  { id: 1279, description: "Cottage - Roof, Replacement", building: "Cottage", category: "Roofing", placedInServiceYear: 2005, usefulLife: 30, adjustment: 0, replacementYear: 2035, actualCost: 9000 },
  { id: 1283, description: "Cottage - Siding, Replacement", building: "Cottage", category: "Building Components", placedInServiceYear: 1989, usefulLife: 40, adjustment: 0, replacementYear: 2029, actualCost: 18000 },
  { id: 1282, description: "Cottage - Window/Door, Replacements", building: "Cottage", category: "Building Components", placedInServiceYear: 1989, usefulLife: 40, adjustment: 0, replacementYear: 2029, actualCost: 6000 },
  { id: 1297, description: "Cottage - Exterior Paint", building: "Cottage", category: "Building Components", placedInServiceYear: 2023, usefulLife: 5, adjustment: 0, replacementYear: 2028, actualCost: 4000 },
  // Boathouse
  { id: 1285, description: "Boathouse - Roof, Replacement", building: "Boathouse", category: "Roofing", placedInServiceYear: 2005, usefulLife: 30, adjustment: 0, replacementYear: 2035, actualCost: 28000 },
  { id: 1289, description: "Dock Maintenance", building: "Dock", category: "Grounds Components", placedInServiceYear: 2020, usefulLife: 10, adjustment: 0, replacementYear: 2030, actualCost: 50000 },
  { id: 1298, description: "Boathouse - Window/Door Replacements", building: "Boathouse", category: "Building Components", placedInServiceYear: 1988, usefulLife: 40, adjustment: 0, replacementYear: 2028, actualCost: 15000 },
  { id: 1299, description: "Boathouse - Siding Replacement", building: "Boathouse", category: "Building Components", placedInServiceYear: 1987, usefulLife: 40, adjustment: 0, replacementYear: 2027, actualCost: 40000 },
  { id: 1300, description: "Boathouse - Framing/Foundation Repairs", building: "Boathouse", category: "Building Components", placedInServiceYear: 1992, usefulLife: 40, adjustment: 0, replacementYear: 2032, actualCost: 25000 },
  { id: 1301, description: "Boathouse - Chimney Repair", building: "Boathouse", category: "Building Components", placedInServiceYear: 1998, usefulLife: 30, adjustment: 0, replacementYear: 2028, actualCost: 10000 },
  // Icehouse
  { id: 1284, description: "Icehouse - Roof, Replacement", building: "Icehouse", category: "Roofing", placedInServiceYear: 1998, usefulLife: 30, adjustment: 0, replacementYear: 2028, actualCost: 3000 },
  { id: 1302, description: "Icehouse - Siding/Structural Repairs", building: "Icehouse", category: "Building Components", placedInServiceYear: 1997, usefulLife: 40, adjustment: 0, replacementYear: 2037, actualCost: 5000 },
  { id: 1303, description: "Icehouse - Exterior Paint", building: "Icehouse", category: "Building Components", placedInServiceYear: 2025, usefulLife: 5, adjustment: 0, replacementYear: 2030, actualCost: 2000 },
  // Garage
  { id: 1286, description: "Garage - Roof, Replacement", building: "Garage", category: "Roofing", placedInServiceYear: 2001, usefulLife: 50, adjustment: 0, replacementYear: 2051, actualCost: 25000 },
  { id: 1304, description: "Garage - Siding/Structural Repairs", building: "Garage", category: "Building Components", placedInServiceYear: 1997, usefulLife: 40, adjustment: 0, replacementYear: 2037, actualCost: 7000 },
  // Zing House
  { id: 1288, description: "Zing House - Roof, Replacement", building: "Zing House", category: "Roofing", placedInServiceYear: 2024, usefulLife: 30, adjustment: 0, replacementYear: 2054, actualCost: 4000 },
  { id: 1305, description: "Zing House - Siding/Structural Repairs", building: "Zing House", category: "Building Components", placedInServiceYear: 2002, usefulLife: 40, adjustment: 0, replacementYear: 2042, actualCost: 3500 },
  // Studio
  { id: 1287, description: "Studio - Roof, Replacement", building: "Studio", category: "Roofing", placedInServiceYear: 2005, usefulLife: 30, adjustment: 0, replacementYear: 2035, actualCost: 4000 },
  { id: 1306, description: "Studio - Siding/Structural Repairs", building: "Studio", category: "Building Components", placedInServiceYear: 1992, usefulLife: 40, adjustment: 0, replacementYear: 2032, actualCost: 2500 },
  // Grounds
  { id: 1307, description: "Tennis Court Major Rehabilitation", building: "Tennis Court", category: "Grounds Components", placedInServiceYear: 2019, usefulLife: 10, adjustment: 0, replacementYear: 2029, actualCost: 14000 },
  { id: 1265, description: "Septic System - Replacements", building: "Septic System", category: "Grounds Components", placedInServiceYear: 2015, usefulLife: 30, adjustment: 0, replacementYear: 2045, actualCost: 50000 },
  { id: 1290, description: "Driveway Maintenance", building: "Driveway", category: "Grounds Components", placedInServiceYear: 2024, usefulLife: 5, adjustment: 0, replacementYear: 2029, actualCost: 5000 },
  { id: 1308, description: "Woodshed - Roof, Replacement", building: "Woodshed", category: "Roofing", placedInServiceYear: 2002, usefulLife: 30, adjustment: 0, replacementYear: 2032, actualCost: 1000 },
  { id: 1291, description: "Tree Work", building: "Forestry", category: "Grounds Components", placedInServiceYear: 2027, usefulLife: 5, adjustment: 0, replacementYear: 2032, actualCost: 10000 },
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
