import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { Redirect } from "../../entities/Redirect";
import { ClicksService, GetClickGraphics } from "../../services/clicks";
import { RedirectsService } from "../../services/redirects";
import { useAuthStore } from "../../shared/state";
import DashboardChart from "./components/DashboardChart";
import DashboardHeader from "./components/DashboardHeader";

const redirectsService = new RedirectsService();
const clicksService = new ClicksService();

export type PageState = {};

const DashboardHome = () => {
  const { data: redirectsResponse } = useSWR(
    ["/api/redirects"],
    () => {
      return redirectsService.getMany({
        owner: authStore.user?.id,
        limit: 30,
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
  const authStore = useAuthStore();

  const [getClickGraphicsFilters, setGetClickGraphicsFilters] =
    useState<GetClickGraphics>({
      owner: authStore.user?.id,
    });
  const {
    data: response,
    mutate,
    isValidating,
  } = useSWR(
    ["/api/clicks/graphics", getClickGraphicsFilters],
    () => {
      if (!authStore.user?.id) return undefined;
      return clicksService.getGraphicData(getClickGraphicsFilters);
    },
    {
      onError: (err) => {
        toast(err?.message, {
          type: "error",
        });
      },
    }
  );

  const parseRedirectToComboBoxItem = useCallback(
    (r: Redirect) => ({
      ...r,
      label: r.name,
      id: r.id as string,
    }),
    []
  );

  useEffect(() => {
    setGetClickGraphicsFilters((oldState) => ({
      ...oldState,
      owner: authStore.user?.id,
    }));
  }, [authStore]);

  return (
    <div className="flex flex-col w-full h-full">
      <DashboardHeader
        comboBoxProps={{
          items: (redirectsResponse?.results || []).map(
            parseRedirectToComboBoxItem
          ),
          query: "",
          setQuery: (newQuery) => {
            console.log({ newQuery });
          },
          selected:
            redirectsResponse?.results?.[0] &&
            parseRedirectToComboBoxItem(redirectsResponse?.results?.[0]),
          setSelected: (selected) => {
            console.log({ selected });
            setGetClickGraphicsFilters((oldState) => ({
              ...oldState,
              redirect: selected?.id as string,
            }));
          },
        }}
      />

      {!!response && (
        <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-2 ">
          <div className="flex flex-col justify-center items-center">
            <span className="font-light">Clicks by day</span>
            <DashboardChart
              valueKeys={response.destinationNames}
              data={response.graphicData.by_destination_name.day}
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <span className="font-light">Clicks by hour</span>
            <DashboardChart
              valueKeys={response.destinationNames}
              data={response.graphicData.by_destination_name.day_hour}
            />
          </div>

          <div className="flex flex-col justify-center items-center">
            <span className="font-light">Clicks by time</span>
            <DashboardChart
              valueKeys={response.destinationNames}
              data={response.graphicData.by_destination_name.day_hour_minute}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
