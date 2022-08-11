import React from "react";

export type ActionProps = {
  label: string;
  onClick: () => void;
};
const Action = ({ label, onClick }: ActionProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="TableAction text-indigo-600 hover:text-indigo-900"
    >
      {label}
    </button>
  );
};

export default Action;
