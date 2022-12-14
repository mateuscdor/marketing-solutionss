import React, { useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import get from "lodash/get";
import InputTextGroup from "../../../components/inputs-groups/text";
import BaseModal, { BaseModalProps } from "../../../components/modals/base";
import { Redirect } from "../../../entities/Redirect";
import Select from "../../../components/inputs-groups/select";
import { REDIRECT_STRATEGIES } from "../../../enum";
import { omit } from "lodash";

export type RedirectionModalProps = {
  entity?: Redirect;
  onCreate: (data: Redirect) => void;
  onUpdate: (id: string, data: Omit<Redirect, "destinations">) => void;
} & Omit<BaseModalProps, "children">;
const RedirectionModal = ({
  entity,
  onCreate,
  onUpdate,
  ...baseProps
}: RedirectionModalProps) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Redirect>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "destinations",
  });

  const strategy = watch("strategy");
  const modalType = useMemo(() => {
    return !!entity ? "edit" : "create";
  }, [entity]);

  useEffect(() => {
    setValue("name", entity?.name || "");
    setValue("owner", entity?.owner || "");
    setValue(
      "strategy",
      entity?.strategy || REDIRECT_STRATEGIES.clicksPerDestination.id
    );
    setValue("maxClicksPerDestination", entity?.maxClicksPerDestination);
  }, [entity, setValue]);

  const title = useMemo(() => {
    return entity ? "Update Redirection" : "Create Redirection";
  }, [entity]);

  const onSubmit = handleSubmit((data) => {
    if (!entity) return onCreate(data);

    return onUpdate(entity.id as string, omit(data, "destinations"));
  });

  return (
    <BaseModal {...baseProps}>
      <form className="space-y-8" onSubmit={onSubmit}>
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
              {modalType === "create" && (
                <>
                  <div className="flex w-full justify-end -mb-8">
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() =>
                        append({
                          url: "",
                          owner: entity?.owner as string,
                          name: "",
                        })
                      }
                    >
                      Add new
                    </button>
                  </div>
                  {fields.map((field: any, index: number) => {
                    const urlFieldId =
                      `destinations.${index}.url` as `destinations.${number}.url`;

                    const nameFieldId =
                      `destinations.${index}.name` as `destinations.${number}.name`;

                    const urlErrorMessage = get(
                      errors,
                      `destinations.${index}.url.message`
                    );
                    const nameErrorMessage = get(
                      errors,
                      `destinations.${index}.name.message`
                    );
                    return (
                      <div
                        key={field.id}
                        className="flex flex-row w-full items-center"
                      >
                        <div className="flex flex-col w-full justify-around">
                          <span className="font-semibold">{`Destination ${
                            index + 1
                          }`}</span>
                          <div className="flex w-full justify-around space-x-2">
                            <InputTextGroup
                              errorMessage={nameErrorMessage}
                              label="Name"
                              inputProps={register(nameFieldId, {
                                required: true,
                              })}
                            />
                            <InputTextGroup
                              errorMessage={urlErrorMessage}
                              label="Url"
                              inputProps={register(urlFieldId, {
                                minLength: {
                                  value: 5,
                                  message: "Must be greather than 4",
                                },
                                required: true,
                              })}
                            />
                          </div>
                        </div>
                        <button
                          className="h-min inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          type="button"
                          onClick={() => remove(index)}
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
          <div>
            <h3 className="text-lg leading-5 font-medium text-gray-900">
              Strategy
            </h3>
            <p className="mt-1 max-w-xl text-sm text-gray-500">
              This will be the logic used to decide the destination.
            </p>
          </div>
          <div className="space-y-6 sm:space-y-5">
            <Select
              selectProps={{
                ...register("strategy", {
                  required: true,
                  onBlur: (e) => {
                    console.log("onBlur", e.target.value);
                    setValue("strategy", e.target.value);
                  },
                }),
              }}
              label="Strategy type"
              errorMessage={errors?.strategy?.message}
              options={Object.values(REDIRECT_STRATEGIES).map((strategy) => ({
                label: strategy.label,
                value: strategy.id,
              }))}
            />
            {[
              REDIRECT_STRATEGIES.clicksPerDestination.id,
              REDIRECT_STRATEGIES.uniqueClicksPerDestination.id,
            ].includes(strategy) && (
              <InputTextGroup
                label="Max clicks per destination"
                errorMessage={errors?.maxClicksPerDestination?.message}
                inputProps={{
                  ...register("maxClicksPerDestination", {
                    required: true,
                    valueAsNumber: true,
                  }),
                  type: "number",
                }}
              />
            )}
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

export default RedirectionModal;
