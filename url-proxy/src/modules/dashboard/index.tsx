import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import SimpleHeader from "../../components/headers/simple";
import ComboBox from "../../components/inputs/combo-box";
import { Redirect } from "../../entities/Redirect";
import { RedirectGroup } from "../../entities/RedirectGroup";
import { CHART_COLOR_BY_TYPE } from "../../enum";
import { ClicksService, GetClickGraphics } from "../../services/clicks";
import { RedirectGroupsService } from "../../services/redirect-groups";
import { useAuthStore } from "../../shared/state";
import { getRandomHEXColor } from "../../utils";
import DashboardChart from "./components/DashboardChart";

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
      refreshInterval: 60_000 * 5,
    }
  );

  const parseRedirectGroupToComboBoxItem = useCallback(
    (r: RedirectGroup) => ({
      ...r,
      label: r.name,
      id: r.id as string,
    }),
    []
  );

  const graphicDestinationColors = useMemo(() => {
    if (!response?.graphicData?.by_destination_name?.day) return {};

    return Object.keys(response?.graphicData.by_destination_name.day[0]).reduce(
      (acc, key) => {
        const cacheKey = `@traffic_graphic_color_${key}`;
        const cachedColor = sessionStorage.getItem(cacheKey);
        if (cachedColor) {
          return {
            ...acc,
            [key]: cachedColor,
          };
        }
        const randomColor = getRandomHEXColor();

        sessionStorage.setItem(cacheKey, randomColor);

        return {
          ...acc,
          [key]: randomColor,
        };
      },
      {}
    );
  }, [response?.graphicData.by_destination_name.day]);

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
                colorsEnum={graphicDestinationColors}
                data={response?.graphicData?.by_destination_name?.day}
              />
            </div>

            <div className="flex flex-col justify-center items-center">
              <span className="font-light">Hourly</span>
              <DashboardChart
                colorsEnum={graphicDestinationColors}
                data={response?.graphicData?.by_destination_name?.day_hour}
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
                colorsEnum={CHART_COLOR_BY_TYPE}
                data={response?.graphicData?.by_click_type?.day}
              />
            </div>

            <div className="flex flex-col justify-center items-center">
              <span className="font-light">Hourly</span>
              <DashboardChart
                colorsEnum={CHART_COLOR_BY_TYPE}
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
