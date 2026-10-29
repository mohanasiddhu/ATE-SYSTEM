export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidIndianPlate(plate: string): boolean {
  const clean = plate.replace(/\s+/g, '').toUpperCase();
  return /^[A-Z]{2}[0-9]{2}[A-Z]{0,3}[0-9]{4}$/.test(clean);
}
