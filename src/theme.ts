import type { Category } from "./types";

export const CATEGORY_COLOR: Record<Category, string> = {
  Roofing: "var(--cat-roofing)",
  "Interior Furnishings": "var(--cat-interior)",
  Equipment: "var(--cat-equipment)",
  "Building Components": "var(--cat-building)",
  "Grounds Components": "var(--cat-grounds)",
};

export const CATEGORY_HEX: Record<Category, string> = {
  Roofing: "#3b6ea5",
  "Interior Furnishings": "#c28b3c",
  Equipment: "#6b4e8e",
  "Building Components": "#3e8e7e",
  "Grounds Components": "#a35b3b",
};

export const CATEGORY_HEX_DESAT: Record<Category, string> = {
  Roofing: "#6b87a5",
  "Interior Furnishings": "#b0986c",
  Equipment: "#8a7a9e",
  "Building Components": "#6a9a8e",
  "Grounds Components": "#a07868",
};
