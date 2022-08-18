import type { NextPage } from "next";
import { useCallback, useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import ManageHeader from "../../components/headers/manage";
import Table from "../../components/table";
import { RedirectGroup } from "../../entities/RedirectGroup";
import { RedirectGroupsService } from "../../services/redirect-groups";
import RedirectGroupModal from "./components/RedirectGroupsModal";
import { useRouter } from "next/router";
import { useAuthStore } from "../../shared/state";
import { omit } from "lodash";
import truncate from "lodash/truncate";
import DeleteResourceModal from "../../components/modals/delete-resource";
import usePersistentState from "../../shared/hooks/usePersistentState";
import { PaginationFilters } from "../../shared/types";
import format from "date-fns/format";

const service = new RedirectGroupsService();

export type PageState = {
  selectedEntity?: RedirectGroup;
  modalIsOpen: boolean;
  deleteModalIsOpen: boolean;
};
export type RedirectGroupsHomeProps = {};
const RedirectGroupsHome: NextPage<RedirectGroupsHomeProps> = ({}) => {
  const authStore = useAuthStore();
  const router = useRouter();
  const [paginationFilters, setPaginationFilters] =
    usePersistentState<PaginationFilters>(
      "RedirectGroupsHomePaginationFilters",
      {
        defaultValue: {
          limit: 10,
          skip: 0,
        },
      }
    );
  const {
    data: entitiesResponse,
    mutate,
    isValidating,
  } = useSWR(
    [`/api/redirect-groups`, paginationFilters],
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
        title="Redirect Groups"
        description="A list of all the redirectGroups in your account."
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

          {
            key: "createdAt",
            label: "Created",
          },
        ]}
        data={(entitiesResponse?.results || []).map((redirectGroup) => {
          return {
            ...redirectGroup,
            createdAt: format(
              new Date(redirectGroup.createdAt as string),
              "dd/MM/yy"
            ),
          };
        })}
        actions={[
          {
            label: "Redirects",
            onClick: ({ item, index }) => {
              console.debug("Going to redirects", { item });

              router.push({
                pathname: `/redirects`,
                query: {
                  redirectGroupId: item.id,
                  redirectGroupName: item.name,
                },
              });
            },
          },
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
      <RedirectGroupModal
        isOpen={pageState.modalIsOpen}
        setOpen={setModalIsOpen}
        entity={pageState.selectedEntity as any}
        onCreate={async (data) => {
          const body = {
            ...data,
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
          title={`Delete redirects group ${truncate(
            pageState.selectedEntity?.name,
            {
              length: 20,
            }
          )}`}
          description={`Are you sure you want to delete the redirects group ${pageState.selectedEntity?.name}? This redirects group will be permanently removed
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
    </div>
  );
};

export default RedirectGroupsHome;
