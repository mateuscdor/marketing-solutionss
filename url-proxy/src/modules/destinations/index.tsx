import type { NextPage } from "next";
import { useCallback, useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import ManageHeader from "../../components/headers/manage";
import Table from "../../components/table";
import { Destination } from "../../entities/Destination";
import DashboardLayout from "../../layouts/dashboard";
import { DestinationsService } from "../../services/destinations";
import DestinationionModal from "./components/DestinationsModal";

const service = new DestinationsService();

export type PageState = {
  selectedEntity?: Destination;
  modalIsOpen: boolean;
};
export type DestinationsHomeProps = {
  redirectId: string;
};
const DestinationsHome: NextPage<DestinationsHomeProps> = ({ redirectId }) => {
  const { data: entitiesResponse, mutate } = useSWR(
    `/api/destinations/${redirectId}/destinations`,
    () => {
      return service.getMany({
        redirectId,
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
        title="Destinations"
        description="A list of all the destinations in your account."
      />
      <Table
        columns={[
          {
            key: "url",
            label: "Url",
          },
        ]}
        data={entitiesResponse?.results || []}
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
      />
      <DestinationionModal
        isOpen={pageState.modalIsOpen}
        setOpen={setModalIsOpen}
        entity={pageState.selectedEntity as any}
        onCreate={async (data) => {
          const body = {
            ...data,
            redirect: redirectId as any,
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

export default DestinationsHome;
