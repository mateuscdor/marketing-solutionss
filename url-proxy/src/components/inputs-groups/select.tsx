import clsx from "clsx";
import React from "react";

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectGroupProps = {
  errorMessage?: string;
  label: string;
  selectProps: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >;
  options: SelectOption[];
};

const Select = ({
  options,
  label,
  selectProps,
  errorMessage,
}: SelectGroupProps) => {
  return (
    <div>
      <label
        htmlFor={selectProps.name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <select
        {...selectProps}
        // className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        className={clsx(
          "py-2 block w-full focus:outline-none sm:text-sm rounded-md",
          !!errorMessage &&
            "pr-10 border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
        )}
      >
        {options.map(({ label, value }) => (
          <option key={`Select_${value}`} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
