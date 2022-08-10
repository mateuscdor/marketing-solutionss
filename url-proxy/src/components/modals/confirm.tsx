import React from "react";
import BaseModal, { BaseModalProps } from "./base";
import { Dialog } from "@headlessui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";

export type ConfirmModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
} & Omit<BaseModalProps, "children">;

const ConfirmModal = ({
  onCancel,
  onConfirm,
  title,
  description,
  ...baseProps
}: ConfirmModalProps) => {
  return (
    <BaseModal {...baseProps}>
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
          <QuestionMarkCircleIcon
            className="h-6 w-6 text-blue-600"
            aria-hidden="true"
          />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <Dialog.Title
            as="h3"
            className="text-lg leading-6 font-medium text-gray-900"
          >
            {title}
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-700 text-base font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-50 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={onConfirm}
        >
          Confirm
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;
