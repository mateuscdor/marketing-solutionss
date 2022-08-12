import { useCallback, useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import ManageHeader from "../../components/headers/manage";
import Table from "../../components/table";
import { Redirect } from "../../entities/Redirect";
import { RedirectsService } from "../../services/redirects";
import RedirectionModal from "./components/RedirectModal";
import { useRouter } from "next/router";
import { useAuthStore } from "../../shared/state";
import { omit, truncate } from "lodash";
import DeleteResourceModal from "../../components/modals/delete-resource";
import usePersistentState from "../../shared/hooks/usePersistentState";
import { PaginationFilters } from "../../shared/types";

const service = new RedirectsService();

export type PageState = {
  selectedEntity?: Redirect;
  modalIsOpen: boolean;
  deleteModalIsOpen: boolean;
};
const RedirectsHome = () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const [paginationFilters, setPaginationFilters] =
    usePersistentState<PaginationFilters>("RedirectsHomePaginationFilters", {
      defaultValue: {
        limit: 10,
        skip: 0,
      },
    });

  const {
    data: entitiesResponse,
    mutate,
    isValidating,
  } = useSWR(
    ["/api/redirects", paginationFilters],
    () => {
      return service.getMany({
        owner: authStore.user?.id,
        ...paginationFilters,
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

  return (
    <div className="flex flex-col w-full h-full">
      <ManageHeader
        onCreateClick={() => {
          console.debug("Creating entity");
          setPageState((oldState) => ({
            ...oldState,
            selectedEntity: undefined,
            modalIsOpen: true,
          }));
        }}
        title="Redirects"
        description="A list of all the redirects in your account."
      />
      <Table
        isLoading={isValidating}
        paginationsProps={
          paginationFilters && {
            ...paginationFilters,
            total: entitiesResponse?.pagination?.total || 0,
            onNextClick: ({ newSkip }) => {
              console.debug({ newSkip });
              setPaginationFilters((oldState) => ({
                ...oldState,
                skip: newSkip,
              }));
            },
            onPreviousClick: ({ newSkip }) => {
              console.debug({ newSkip });
              setPaginationFilters((oldState) => ({
                ...oldState,
                skip: newSkip,
              }));
            },
            ...paginationFilters,
          }
        }
        columns={[
          {
            key: "name",
            label: "Name",
          },
        ]}
        data={(entitiesResponse?.results || []).map((entity) => ({
          ...entity,
          destinations: (entity.destinations || [])
            .map(({ url }) => url)
            .join(", "),
        }))}
        actions={[
          {
            label: "Share",
            onClick: async ({ item, index }) => {
              console.debug("Sharing entity", index);
              const sharedLink = service.getShareUrl(item.id);

              toast("Link copied to clipboard", {
                type: "success",
              });
              navigator.clipboard.writeText(sharedLink);
            },
          },
          {
            label: "Edit",
            onClick: ({ item, index }) => {
              console.debug("Editing entity", index);

              setPageState((oldState) => ({
                ...oldState,
                selectedEntity: item,
                modalIsOpen: true,
              }));
            },
          },
          {
            label: "Destinations",
            onClick: ({ item, index }) => {
              console.debug("Going to destinations", index);

              router.push({
                pathname: `/redirects/${item.id}/destinations`,
                query: {
                  redirectSource: item.name,
                },
              });
            },
          },
          {
            label: "Delete",
            onClick: async ({ item, index }) => {
              console.debug("Opening delete entity modal", index);
              setPageState((oldState) => ({
                ...oldState,
                selectedEntity: item,
                deleteModalIsOpen: true,
              }));
            },
          },
        ]}
      />
      <RedirectionModal
        isOpen={pageState.modalIsOpen}
        setOpen={setModalIsOpen}
        entity={pageState.selectedEntity as any}
        onCreate={async (data) => {
          console.debug("Creating", data);

          const body = {
            ...data,
            owner: authStore.user?.id as string,
            user: authStore.user,
          };

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
            .update(id, omit(data, ["destinations", "owner"]))
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
          title={`Delete redirect ${truncate(pageState.selectedEntity?.name, {
            length: 20,
          })}`}
          description={`Are you sure you want to delete the redirect ${pageState.selectedEntity?.name}? This redirection and all its destinations will be permanently removed
      from our servers forever. This action cannot be undone.`}
          isOpen={pageState.deleteModalIsOpen}
          onDelete={async () => {
            console.debug("Deleting entity", pageState!.selectedEntity!.name);
            await service
              .delete(pageState.selectedEntity?.id as string)
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
    </div>
  );
};

export default RedirectsHome;
