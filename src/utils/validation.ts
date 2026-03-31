export function getIndianLocalNumber(input: string) {
  const digitsOnly = input.replace(/\D/g, "");
  if (digitsOnly.startsWith("91") && digitsOnly.length > 10) {
    return digitsOnly.slice(-10);
  }
  return digitsOnly.slice(-10);
}

export function normalizePhoneInput(input: string) {
  const digitsOnly = input.replace(/\D/g, "");
  return digitsOnly ? `+${digitsOnly}` : "";
}
