import React, { useMemo } from "react";
import clsx from "clsx";
import { PaginationFilters } from "../../shared/types";

export type PaginationFooterOnChangePage = {
  newSkip: number;
} & PaginationFilters;
export type PaginationFooterProps = {
  onNextClick: (param: PaginationFooterOnChangePage) => void;
  onPreviousClick: (param: PaginationFooterOnChangePage) => void;
  disableNextButton?: boolean;
  disablePreviousButton?: boolean;
  results: number;
  total: number;
} & PaginationFilters;

const PaginationFooter = ({
  onNextClick,
  onPreviousClick,
  results,
  skip,
  limit,
  total,
  disableNextButton = false,
  disablePreviousButton = false,
}: PaginationFooterProps) => {
  const { from, to } = useMemo(() => {
    return {
      from: skip + 1,
      to: skip + results,
    };
  }, [skip, results]);

  const isNextButtonDisabled = useMemo(() => {
    return disableNextButton || results < limit || skip + results >= total;
  }, [disableNextButton, limit, results, total, skip]);

  const isPreviousButtonDisabled = useMemo(() => {
    return disablePreviousButton || skip === 0 || skip - limit < 0;
  }, [disablePreviousButton, limit, skip]);

  return (
    <nav
      className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{from}</span> to{" "}
          <span className="font-medium">{to}</span> of{" "}
          <span className="font-medium">{total}</span> results
        </p>
      </div>
      <div className="flex-1 flex justify-between sm:justify-end">
        <button
          onClick={() => {
            onPreviousClick({
              limit,
              skip,
              newSkip: skip - limit,
            });
          }}
          disabled={isPreviousButtonDisabled}
          className={clsx(
            "relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50",
            !!isPreviousButtonDisabled && "text-gray-300 cursor-not-allowed"
          )}
        >
          Previous
        </button>
        <button
          onClick={() => {
            onNextClick({
              limit,
              skip,
              newSkip: skip + limit,
            });
          }}
          disabled={isNextButtonDisabled}
          className={clsx(
            "ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50",
            !!isNextButtonDisabled && "text-gray-300 cursor-not-allowed"
          )}
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export default PaginationFooter;
