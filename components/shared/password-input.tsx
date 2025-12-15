"use client";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = React.ComponentProps<typeof Input> & {
  label?: string;
};

const PasswordInput = ({ className, ...props }: PasswordInputProps) => {
  const [show, setShow] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type: _type, ...inputProps } = props as Omit<
    PasswordInputProps,
    "className"
  >;
  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        {...inputProps}
        className={`pr-10  ${className ?? ""}`}
      />

      <Button
        type="button"
        variant="ghost"
        onMouseDown={(e) => e.preventDefault()}
        size="icon"
        onClick={() => setShow(!show)}
        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default PasswordInput;
