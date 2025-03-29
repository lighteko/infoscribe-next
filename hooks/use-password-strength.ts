import { useState } from "react";

export interface PasswordStrength {
  isValid: boolean;
  message: string;
  score: number;
}

export function usePasswordStrength() {
  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrength | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validatePasswordStrength = (password: string): PasswordStrength => {
    // Start with basic validity
    let isValid = true;
    let message = "";
    let score = 0;

    // Check minimum length
    if (password.length < 8) {
      isValid = false;
      message = "Password must be at least 8 characters long";
      return { isValid, message, score };
    }

    // Check complexity
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    // Require at least 3 character types for a strong password
    if (score < 3) {
      isValid = false;
      message = "Include at least 3: uppercase, lowercase, numbers, symbols";
      return { isValid, message, score };
    }

    // Determine strength message based on score
    if (score === 3) {
      message = "Password strength: Good";
    } else if (score === 4) {
      message = "Password strength: Excellent";
    }

    return { isValid, message, score };
  };

  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(null);
      setError(null);
      return null;
    }

    const result = validatePasswordStrength(password);
    setPasswordStrength(result);

    if (!result.isValid) {
      setError(result.message);
    } else {
      setError(null);
    }

    return result;
  };

  const resetPasswordStrength = () => {
    setPasswordStrength(null);
    setError(null);
  };

  return {
    passwordStrength,
    error,
    validatePasswordStrength,
    checkPasswordStrength,
    resetPasswordStrength,
  };
}
