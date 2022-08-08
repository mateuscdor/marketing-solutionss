import type { NextPage } from "next";
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
import { omit } from "lodash";

const service = new RedirectsService();

export type PageState = {
  selectedEntity?: Redirect;
  modalIsOpen: boolean;
};
const RedirectsHome = () => {
  const router = useRouter();
  const authStore = useAuthStore();

  const { data: entitiesResponse, mutate } = useSWR(
    ["/api/redirects"],
    () => {
      return service.getMany({
        owner: authStore.user?.id,
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
  });

  const setModalIsOpen = useCallback((modalIsOpen: boolean) => {
    setPageState((oldState) => ({
      ...oldState,
      modalIsOpen,
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
        columns={[
          {
            key: "source",
            label: "Source",
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
              const origin =
                typeof window !== "undefined" && window.location.origin
                  ? window.location.origin
                  : "";
              const sharedLink = `${origin}/go?origin=${item.id}`;

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
                  redirectSource: item.source,
                },
              });
            },
          },
          {
            label: "Delete",
            onClick: async ({ item, index }) => {
              console.debug("Deleting entity", index);

              await service
                .delete(item.id)
                .then(() => {
                  mutate();
                  setPageState((oldState) => ({
                    ...oldState,
                    modalIsOpen: false,
                    selectedEntity: undefined,
                  }));
                })
                .catch((err) => {
                  toast(err?.message, {
                    type: "error",
                  });
                });
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

          await service
            .create({
              ...data,
              owner: authStore.user?.id as string,
            })
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
    </div>
  );
};

export default RedirectsHome;
