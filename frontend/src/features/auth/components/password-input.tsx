"use client";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface PasswordInputProps {
  id: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  registration: UseFormRegisterReturn;
  error?: string;
}

export default function PasswordInput({
  id,
  label,
  placeholder,
  autoComplete,
  required = false,
  registration,
  error,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          {...registration}
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="pr-10"
          required={required}
        />

        <button
          type="button"
          className="absolute text-muted-foreground right-3 top-1/2 -translate-y-1/2"
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
