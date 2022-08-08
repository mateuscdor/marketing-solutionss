import React, { useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import get from "lodash/get";
import InputTextGroup from "../../../components/inputs-groups/text";
import BaseModal, { BaseModalProps } from "../../../components/modals/base";
import { Destination } from "../../../entities/Destination";

export type DestinationModalProps = {
  entity?: Destination;
  onCreate: (data: Destination) => void;
  onUpdate: (id: string, data: Destination) => void;
} & Omit<BaseModalProps, "children">;
const DestinationModal = ({
  entity,
  onCreate,
  onUpdate,
  ...baseProps
}: DestinationModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Destination>();

  useEffect(() => {
    setValue("url", entity?.url || "");
    setValue("name", entity?.name || "");
    setValue("id", entity?.id || "");
    setValue("owner", entity?.owner || "");
  }, [entity, setValue]);

  const title = useMemo(() => {
    return entity ? "Update Destination" : "Create Destination";
  }, [entity]);
  const onSubmit = handleSubmit((data) => {
    if (!entity) return onCreate(data);

    return onUpdate(entity.id as string, data);
  });

  return (
    <BaseModal {...baseProps}>
      <form className="space-y-8 divide-y divide-gray-200" onSubmit={onSubmit}>
        <div className="divide-gray-200 sm:space-y-5">
          <div>
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {title}
              </h3>
              {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
                This information will be displayed publicly so be careful what
                you share.
              </p> */}
            </div>

            <div className="flex flex-col py-6 space-y-8">
              <InputTextGroup
                label="Name"
                errorMessage={errors?.name?.message}
                inputProps={register("name", {
                  required: true,
                })}
              />
              <InputTextGroup
                label="Source Url"
                errorMessage={errors?.url?.message}
                inputProps={register("url", {
                  required: true,
                })}
              />
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => baseProps.setOpen(false)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
};

export default DestinationModal;
