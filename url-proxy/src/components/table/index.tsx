/* This example requires Tailwind CSS v2.0+ */
const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];

export type TablePropsColumn = {
  key: string;
  label: string;
};
export type TableProps = {
  columns: TablePropsColumn[];
  data: any[];
  onEditClick?: (index: number, item: any) => void;
  onDeleteClick?: (index: number, item: any) => void;
  onShareClick?: (index: number, item: any) => void;

  extraActionsComponent?: React.ReactNode;
};
const Table = ({
  columns,
  data,
  onEditClick,
  onDeleteClick,
  onShareClick,
}: TableProps) => {
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
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((item, itemIndex) => {
            return (
              <tr key={item.id}>
                {columns.map((column) => (
                  <td key={`column-${item.id}-${column.key}`}>
                    {item[column.key]}
                  </td>
                ))}
                <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                  {onShareClick && (
                    <button
                      type="button"
                      onClick={() => onShareClick(itemIndex, item)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Share
                    </button>
                  )}
                  {onEditClick && (
                    <button
                      type="button"
                      onClick={() => onEditClick(itemIndex, item)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                  )}
                  {onDeleteClick && (
                    <button
                      type="button"
                      onClick={() => onDeleteClick(itemIndex, item)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Delete
                    </button>
                  )}
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
