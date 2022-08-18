import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import SimpleHeader from "../../components/headers/simple";
import ComboBox from "../../components/inputs/combo-box";
import { Redirect } from "../../entities/Redirect";
import { RedirectGroup } from "../../entities/RedirectGroup";
import { ClicksService, GetClickGraphics } from "../../services/clicks";
import { RedirectGroupsService } from "../../services/redirect-groups";
import { RedirectsService } from "../../services/redirects";
import { useAuthStore } from "../../shared/state";
import DashboardChart from "./components/DashboardChart";

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
    return undefined;
  }, [
    getClickGraphicsFilters.redirectGroup,
    parseRedirectGroupToComboBoxItem,
    redirectGroupsResponse,
  ]);

  return (
    <div className="flex flex-col w-full h-full">
      <SimpleHeader title="Dashboard" />
      <div className="flex flex-col w-full h-full items-start pl-4">
        <h3 className="text-md font-light text-gray-900">Filters</h3>
        <div className="flex flex-row w-full h-full">
          <div className="flex flex-col justify-center pl-16">
            <h3 className="text-left text-md font-thin text-black pr-8">
              Redirect group
            </h3>
            <ComboBox
              items={(redirectGroupsResponse?.results || []).map(
                parseRedirectGroupToComboBoxItem
              )}
              query={""}
              setQuery={(newQuery) => {
                console.log({ newQuery });
              }}
              selected={selectedRedirectGroupOption}
              setSelected={(selected) => {
                console.log({ selected });
                setGetClickGraphicsFilters((oldState) => ({
                  ...oldState,
                  redirectGroup: selected?.id as string,
                }));
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 w-full border-b border-gray-300"></div>
      {!!response && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 p-4">
            By destination
          </h3>
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 ">
            <div className="flex flex-col justify-center items-center">
              <span className="font-light">Daily</span>
              <DashboardChart
                valueKeys={response.destinationNames}
                data={response?.graphicData?.by_click_type?.day}
              />
            </div>

            <div className="flex flex-col justify-center items-center">
              <span className="font-light">Hourly</span>
              <DashboardChart
                valueKeys={response.destinationNames}
                data={response?.graphicData?.by_click_type?.day_hour}
              />
            </div>
          </div>
        </div>
      )}
      {!!response && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 p-4">
            By click type
          </h3>
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 ">
            <div className="flex flex-col justify-center items-center">
              <span className="font-light">Daily</span>
              <DashboardChart
                valueKeys={response.destinationNames}
                data={response?.graphicData?.by_click_type?.day}
              />
            </div>

            <div className="flex flex-col justify-center items-center">
              <span className="font-light">Hourly</span>
              <DashboardChart
                valueKeys={response.destinationNames}
                data={response?.graphicData?.by_click_type?.day_hour}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
