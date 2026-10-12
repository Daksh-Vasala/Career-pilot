import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps {
  id: string;
  label: string;
  type: React.ComponentProps<typeof Input>["type"];
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  registration: UseFormRegisterReturn;
  error?: string;
}

export default function FormField({
  id,
  label,
  type,
  placeholder,
  autoComplete,
  required = false,
  registration,
  error,
}: FormFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        {...registration}
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />

      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
