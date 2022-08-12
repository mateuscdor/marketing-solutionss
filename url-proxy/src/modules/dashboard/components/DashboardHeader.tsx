import React from "react";
import RedirectComboBox from "./RedirectComboBox";

// import { Container } from './styles';

const DashboardHeader: React.FC = () => {
  return (
    <div className="sm:flex sm:items-center p-4">
      <div className="sm:flex-auto">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <RedirectComboBox />
      </div>
    </div>
  );
};

export default DashboardHeader;
