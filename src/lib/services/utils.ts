import DOMPurify from "isomorphic-dompurify";

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  return true;
}

export function validatePassword(password: string): boolean {
  const passwordRegex = /^[a-zA-Z0-9]{3,30}$/;
  if (password.length < 6 || !passwordRegex.test) {
    return false;
  }
  return true;
}
