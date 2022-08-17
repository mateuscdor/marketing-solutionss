import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { Redirect } from "../../entities/Redirect";
import { RedirectGroup } from "../../entities/RedirectGroup";
import { ClicksService, GetClickGraphics } from "../../services/clicks";
import { RedirectGroupsService } from "../../services/redirect-groups";
import { RedirectsService } from "../../services/redirects";
import { useAuthStore } from "../../shared/state";
import DashboardChart from "./components/DashboardChart";
import DashboardHeader from "./components/DashboardHeader";

const redirectsService = new RedirectsService();
const redirectGroupsService = new RedirectGroupsService();

const clicksService = new ClicksService();

export type PageState = {};

const DashboardHome = () => {
  const { data: redirectGroupsResponse } = useSWR(
    ["/api/redirect-groups"],
    () => {
      return redirectGroupsService.getMany({
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
  const authStore = useAuthStore();

  const [getClickGraphicsFilters, setGetClickGraphicsFilters] =
    useState<GetClickGraphics>({});
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
  const parseRedirectGroupToComboBoxItem = useCallback(
    (r: RedirectGroup) => ({
      ...r,
      label: r.name,
      id: r.id as string,
    }),
    []
  );

  const selectedRedirectGroupOption = useMemo(() => {
    if (
      getClickGraphicsFilters.redirectGroup &&
      redirectGroupsResponse?.results?.[0]
    ) {
      return parseRedirectGroupToComboBoxItem(
        redirectGroupsResponse!.results!.find(
          (r) => r.id === getClickGraphicsFilters.redirectGroup
        ) as RedirectGroup
      );
    }
    return (
      redirectGroupsResponse?.results?.[0] &&
      parseRedirectGroupToComboBoxItem(redirectGroupsResponse?.results?.[0])
    );
  }, [
    getClickGraphicsFilters.redirectGroup,
    parseRedirectGroupToComboBoxItem,
    redirectGroupsResponse,
  ]);

  return (
    <div className="flex flex-col w-full h-full">
      <DashboardHeader
        comboBoxProps={{
          items: (redirectGroupsResponse?.results || []).map(
            parseRedirectGroupToComboBoxItem
          ),
          query: "",
          setQuery: (newQuery) => {
            console.log({ newQuery });
          },
          selected: selectedRedirectGroupOption,
          setSelected: (selected) => {
            console.log({ selected });
            setGetClickGraphicsFilters((oldState) => ({
              ...oldState,
              redirectGroup: selected?.id as string,
            }));
          },
        }}
      />

      {!!response && (
        <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-2 ">
          {!!response.graphicData.by_destination_name.day && (
            <div className="flex flex-col justify-center items-center">
              <span className="font-light">Clicks by day</span>
              <DashboardChart
                valueKeys={response.destinationNames}
                data={response.graphicData.by_destination_name.day}
              />
            </div>
          )}

          {!!response.graphicData.by_destination_name.day_hour && (
            <div className="flex flex-col justify-center items-center">
              <span className="font-light">Clicks by hour</span>
              <DashboardChart
                valueKeys={response.destinationNames}
                data={response.graphicData.by_destination_name.day_hour}
              />
            </div>
          )}

          {!!response.graphicData.by_destination_name.day_hour_minute && (
            <div className="flex flex-col justify-center items-center">
              <span className="font-light">Clicks by time</span>
              <DashboardChart
                valueKeys={response.destinationNames}
                data={response.graphicData.by_destination_name.day_hour_minute}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
