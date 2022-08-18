import React from "react";

export type SimpleHeaderProps = {
  title: string;
};
const SimpleHeader = ({ title }: SimpleHeaderProps) => {
  return (
    <div className="sm:flex sm:items-center p-4">
      <div className="sm:flex-auto">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>
    </div>
  );
};

export default SimpleHeader;
