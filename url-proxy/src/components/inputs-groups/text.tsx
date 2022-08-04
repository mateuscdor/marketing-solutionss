import { ExclamationCircleIcon } from "@heroicons/react/outline";
import React, { useMemo } from "react";

import clsx from "clsx";

// import { Container } from './styles';

export type InputTextGroupProps = {
  errorMessage?: string;
  label: string;
  inputProps: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
};
const InputTextGroup = ({
  errorMessage,
  label,
  inputProps,
}: InputTextGroupProps) => {
  const errorProps = useMemo(() => {
    return errorMessage
      ? {
          "aria-invalid": true,
          "aria-describedby": `${inputProps.name}-error`,
        }
      : {};
  }, [errorMessage, inputProps.name]);

  return (
    <div>
      <label
        htmlFor={inputProps.name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          className={clsx(
            "py-2 block w-full focus:outline-none sm:text-sm rounded-md",
            !!errorMessage &&
              "pr-10 border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 "
          )}
          {...errorProps}
          {...inputProps}
        />

        {!!errorMessage && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {errorMessage && (
        <p
          className="mt-2 text-sm text-red-600"
          id={`${inputProps.name}-error`}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default InputTextGroup;
