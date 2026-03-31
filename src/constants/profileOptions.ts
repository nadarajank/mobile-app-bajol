import { INDIAN_STATES } from "./stateOptions";

export const COUNTRY_OPTIONS = ["India"] as const;
export const GENDER_OPTIONS = ["male", "female", "transgender"] as const;
export const MARRIAGE_COUNT_OPTIONS = ["first", "second", "third"] as const;
export const MARRIAGE_PERSON_OPTIONS = [
  "me",
  "sister",
  "brother",
  "son",
  "daughter",
  "other",
] as const;

export const PROFILE_REQUIRED_FIELDS = [
  "name",
  "age",
  "job",
  "monthlySalary",
  "country",
  "state",
  "district",
  "phone_number",
  "whatsapp",
  "caste",
  "religion",
  "gender",
  "count",
  "person",
  "height",
  "weight",
] as const;

export function hasRequiredProfileData(data: Record<string, unknown> | null | undefined) {
  if (!data) {
    return false;
  }

  return PROFILE_REQUIRED_FIELDS.every((field) => {
    const value = data[field];
    return value !== undefined && value !== null && String(value).trim() !== "";
  });
}

export const STATE_OPTIONS = [...INDIAN_STATES];
