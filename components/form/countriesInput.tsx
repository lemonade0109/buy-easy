import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Flag from "react-world-flags";
import { formattedCountries } from "@/lib/utils";

const name = "country";

interface CountriesInputProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const CountriesInput = ({ defaultValue, onChange }: CountriesInputProps) => {
  return (
    <Select
      defaultValue={defaultValue || formattedCountries[0].code}
      name={name}
      required
      onValueChange={onChange}
    >
      <SelectTrigger id={name} className="w-full">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {formattedCountries.map((country) => {
          return (
            <SelectItem key={country.code} value={country.code}>
              <span className="flex items-center gap-2">
                <Flag code={country.code} style={{ width: 20, height: 20 }} />{" "}
                {country.name}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default CountriesInput;
