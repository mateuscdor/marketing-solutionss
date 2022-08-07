import Action, { ActionProps } from "./action";

export type TablePropsColumn = {
  key: string;
  label: string;
};

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
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={`column-${column.key}`}
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                {column.label}
              </th>
            ))}
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white px-4">
          {data.map((item, itemIndex) => {
            return (
              <tr key={item.id}>
                {columns.map((column) => (
                  <td key={`column-${item.id}-${column.key}`}>
                    <span>{item[column.key]}</span>
                  </td>
                ))}
                <td className="flex flex-col py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 justify-start items-start lg:space-x-2 lg:flex-row lg:justify-end">
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
