import type { NextPage } from "next";
import { useCallback, useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import ManageHeader from "../../components/headers/manage";
import Table from "../../components/table";
import { Destination } from "../../entities/Destination";
import { DestinationsService } from "../../services/destinations";
import DestinationionModal from "./components/DestinationsModal";
import { useRouter } from "next/router";
import { useAuthStore } from "../../shared/state";
import { omit } from "lodash";
import truncate from "lodash/truncate";
import DeleteResourceModal from "../../components/modals/delete-resource";
import ConfirmModal from "../../components/modals/confirm";
import { ShareIcon } from "@heroicons/react/outline";
import { RedirectsService } from "../../services/redirects";

const service = new DestinationsService();
const redirectsService = new RedirectsService();

export type PageState = {
  selectedEntity?: Destination;
  modalIsOpen: boolean;
  deleteModalIsOpen: boolean;
  resetCliksModalIsOpen: boolean;
};
export type DestinationsHomeProps = {
  redirectId: string;
  redirectSource: string;
};
const DestinationsHome: NextPage<DestinationsHomeProps> = ({
  redirectId,
  redirectSource,
}) => {
  const authStore = useAuthStore();
  const router = useRouter();
  const {
    data: entitiesResponse,
    mutate,
    isValidating,
  } = useSWR(
    `/api/destinations/${redirectId}/destinations`,
    () => {
      return service.getMany({
        redirectId,
        owner: authStore.user?.id,
        limit: 10000,
        skip: 0,
      });
    },
    {
      onError: (err) => {
        toast(err?.message, {
          type: "error",
        });
      },
    }
  );

  const [pageState, setPageState] = useState<PageState>({
    selectedEntity: undefined,
    modalIsOpen: false,
    deleteModalIsOpen: false,
    resetCliksModalIsOpen: false,
  });

  const setModalIsOpen = useCallback((modalIsOpen: boolean) => {
    setPageState((oldState) => ({
      ...oldState,
      modalIsOpen,
    }));
  }, []);

  const setDeleteModalIsOpen = useCallback((isOpen: boolean) => {
    setPageState((oldState) => ({
      ...oldState,
      deleteModalIsOpen: isOpen,
    }));
  }, []);
  const setResetClicksModalIsOpen = useCallback((isOpen: boolean) => {
    setPageState((oldState) => ({
      ...oldState,
      resetCliksModalIsOpen: isOpen,
    }));
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex w-full justify-start">
        <div className="p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            onClick={() => {
              router.back();
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
        </div>
      </div>
      <ManageHeader
        onCreateClick={() => {
          console.debug("Creating entity");
          setPageState((oldState) => ({
            ...oldState,
            selectedEntity: undefined,
            modalIsOpen: true,
          }));
        }}
        titleComponent={
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900 mr-4">{`Destinations for ${truncate(
              redirectSource,
              {
                length: 25,
              }
            )}`}</h1>
            <ShareIcon
              className="h-6 w-6 cursor-pointer"
              onClick={() => {
                console.debug("Sharing redirect", redirectId);
                const sharedLink = redirectsService.getShareUrl(redirectId);

                toast("Link copied to clipboard", {
                  type: "success",
                });
                navigator.clipboard.writeText(sharedLink);
              }}
            />
          </div>
        }
        description="A list of all the destinations in your account."
      />
      <Table
        isLoading={isValidating}
        columns={[
          {
            key: "name",
            label: "Name",
          },

          {
            key: "clicks",
            label: "Clicks",
          },
          {
            key: "url",
            label: "Url",
            hiddenOnMobile: true,
          },
        ]}
        data={(entitiesResponse?.results || []).map((destination) => {
          return {
            ...destination,
            url: destination.url,
          };
        })}
        actions={[
          {
            label: "Edit",
            onClick: ({ item, index }) => {
              console.debug("Editing entity", item.name);

              setPageState((oldState) => ({
                ...oldState,
                modalIsOpen: true,
                selectedEntity: entitiesResponse?.results[index],
              }));
            },
          },
          {
            label: "Reset Clicks",
            onClick: async ({ item }) => {
              console.debug("Opening reset clicks modal", item.name);

              setPageState((oldState) => ({
                ...oldState,
                selectedEntity: item,
                resetCliksModalIsOpen: true,
              }));
            },
          },
          {
            label: "Delete",
            onClick: async ({ item }) => {
              console.debug("Opening delete entity modal", item.name);

              setPageState((oldState) => ({
                ...oldState,
                selectedEntity: item,
                deleteModalIsOpen: true,
              }));
            },
          },
        ]}
      />
      <DestinationionModal
        isOpen={pageState.modalIsOpen}
        setOpen={setModalIsOpen}
        entity={pageState.selectedEntity as any}
        onCreate={async (data) => {
          const body = {
            ...data,
            redirect: redirectId as any,
            owner: authStore.user?.id as string,
          };

          console.debug("Creating", body);
          await service
            .create(body)
            .then(() => {
              mutate();
              setModalIsOpen(false);
            })
            .catch((err) => {
              toast(err?.message, {
                type: "error",
              });
            });
        }}
        onUpdate={async (id, data) => {
          console.debug("Updating", data);

          await service
            .update(id, omit(data, "owner"))
            .then(() => {
              mutate();
              setModalIsOpen(false);
            })
            .catch((err) => {
              toast(err?.message, {
                type: "error",
              });
            });
        }}
      />
      {pageState.selectedEntity && (
        <DeleteResourceModal
          title={`Delete destination ${truncate(
            pageState.selectedEntity?.name,
            {
              length: 20,
            }
          )}`}
          description={`Are you sure you want to delete the destination ${pageState.selectedEntity?.name}? This destination will be permanently removed
      from our servers forever. This action cannot be undone.`}
          isOpen={pageState.deleteModalIsOpen}
          onDelete={async () => {
            console.debug("Deleting entity", pageState!.selectedEntity!.name);
            await service
              .delete(pageState!.selectedEntity!.id as string)
              .then(() => {
                mutate();
                setPageState((oldState) => ({
                  ...oldState,
                  deleteModalIsOpen: false,
                  selectedEntity: undefined,
                }));
              })
              .catch((err) => {
                toast(err?.message, {
                  type: "error",
                });
              });
          }}
          onCancel={() => {
            setDeleteModalIsOpen(false);
          }}
          setOpen={setDeleteModalIsOpen}
        />
      )}
      {pageState.selectedEntity && (
        <ConfirmModal
          title={`Reset clicks of ${truncate(pageState.selectedEntity?.name, {
            length: 20,
          })}`}
          description={`Are you sure you want to reset clicks of destination ${pageState.selectedEntity?.name}? The number of clicks will be changed to zero. This action cannot be undone.`}
          isOpen={pageState.resetCliksModalIsOpen}
          onConfirm={async () => {
            console.debug("Reseting clicks", pageState!.selectedEntity!.name);
            await service
              .resetClicks(pageState!.selectedEntity!.id as string)
              .then(() => {
                mutate();
                setPageState((oldState) => ({
                  ...oldState,
                  resetCliksModalIsOpen: false,
                  selectedEntity: undefined,
                }));
              })
              .catch((err) => {
                toast(err?.message, {
                  type: "error",
                });
              });
          }}
          onCancel={() => {
            setResetClicksModalIsOpen(false);
          }}
          setOpen={setResetClicksModalIsOpen}
        />
      )}
    </div>
  );
};

export default DestinationsHome;
