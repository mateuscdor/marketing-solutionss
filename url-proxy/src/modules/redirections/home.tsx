import type { NextPage } from "next";
import { useCallback, useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import ManageHeader from "../../components/headers/manage";
import Table from "../../components/table";
import { Redirect } from "../../entities/Redirect";
import DashboardLayout from "../../layouts/dashboard";
import { RedirectionsService } from "../../services/redirections";
import RedirectionModal from "./components/RedirectionModal";

const service = new RedirectionsService();

export type PageState = {
  selectedEntity?: Redirect;
  modalIsOpen: boolean;
};
const RedirectionsHome: NextPage = () => {
  const { data: entitiesResponse, mutate } = useSWR(
    "/api/redirections",
    () => {
      return service.getMany();
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
    <DashboardLayout>
      <ManageHeader
        onCreateClick={() => {
          console.debug("Creating entity");
          setPageState((oldState) => ({
            ...oldState,
            selectedEntity: undefined,
            modalIsOpen: true,
          }));
        }}
        title="Redirections"
        description="A list of all the redirections in your account."
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
          destinations: entity.destinations.map(({ url }) => url).join(", "),
        }))}
        onEditClick={(entityIndex) => {
          console.debug("Editing entity", entityIndex);

          setPageState((oldState) => ({
            ...oldState,
            modalIsOpen: true,
            selectedEntity: entitiesResponse?.results[entityIndex],
          }));
        }}
        onDeleteClick={async (entityIndex, item) => {
          console.debug("Deleting entity", entityIndex);

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
        }}
        onShareClick={(index, item) => {
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
        }}
      />
      <RedirectionModal
        isOpen={pageState.modalIsOpen}
        setOpen={setModalIsOpen}
        entity={pageState.selectedEntity as any}
        onCreate={async (data) => {
          console.debug("Creating", data);

          await service
            .create(data)
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
            .update(id, data)
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
    </DashboardLayout>
  );
};

export default RedirectionsHome;
