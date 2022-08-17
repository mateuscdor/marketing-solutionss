import React from "react";
import ComboBox, {
  ComboBoxProps,
} from "../../../components/inputs/RedirectComboBox";

export type DashboardHeaderProps = {
  comboBoxProps: ComboBoxProps;
};
const DashboardHeader = ({ comboBoxProps }: DashboardHeaderProps) => {
  return (
    <div className="sm:flex sm:items-center p-4">
      <div className="sm:flex-auto">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <ComboBox {...comboBoxProps} />
      </div>
    </div>
  );
};

export default DashboardHeader;
