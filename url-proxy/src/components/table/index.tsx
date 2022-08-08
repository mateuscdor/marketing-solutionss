import Action, { ActionProps } from "./action";

export type TablePropsColumn = {
  key: string;
  label: string;
};

import truncate from "lodash/truncate";

export type CustomAction = React.ReactNode;

export type TableAction = Omit<ActionProps, "onClick"> & {
  onClick: (props: { item: any; index: number }) => void;
};
export type TableProps = {
  columns: TablePropsColumn[];
  actions: TableAction[];
  data: any[];
};
const Table = ({ columns, data, actions }: TableProps) => {
  return (
    <div className="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
      <table className="flex flex-col w-full bg-yello-400 table-fixed divide-y divide-gray-300">
        <thead className="bg-gray-50 w-full">
          <tr className="w-full flex flex-row justify-between">
            {columns.map((column) => (
              <th
                key={`column-${column.key}`}
                scope="col"
                className="py-3.5 pl-4 pr-3 w-autotext-left  flex justify-start text-sm font-semibold text-gray-900 sm:pl-6"
              >
                {column.label}
              </th>
            ))}
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="w-full sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="flex flex-col  w-full divide-y divide-gray-200 px-4">
          {data.map((item, itemIndex) => {
            return (
              <tr key={item.id} className="flex flex-row items-center w-auto ">
                {columns.map((column) => (
                  <td
                    className="w-full"
                    key={`column-${item.id}-${column.key}`}
                  >
                    <span>{truncate(item[column.key], { length: 36 })}</span>
                  </td>
                ))}

                <td className="flex flex-col py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 justify-start items-start lg:space-x-2 lg:flex-row lg:justify-end w-full">
                  {actions.map((actionProps, index) => {
                    return (
                      <Action
                        key={`TableAction-${index}`}
                        {...actionProps}
                        onClick={() =>
                          actionProps.onClick({
                            item,
                            index: itemIndex,
                          })
                        }
                      />
                    );
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
