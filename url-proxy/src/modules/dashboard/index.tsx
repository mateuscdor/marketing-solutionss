import { ScaleIcon } from "@heroicons/react/solid";
import { toast } from "react-toastify";
import useSWR from "swr";
import { ClicksService } from "../../services/clicks";
import { RedirectsService } from "../../services/redirects";
import DashboardChart from "./components/DashboardChart";
import DashboardHeader from "./components/DashboardHeader";
import RedirectComboBox from "./components/RedirectComboBox";

const redirectsService = new RedirectsService();
const clicksService = new ClicksService();

const cards = [
  { name: "Account balance", href: "#", Icon: ScaleIcon, amount: "$30,659.45" },
  { name: "Account balance", href: "#", Icon: ScaleIcon, amount: "$30,659.45" },
  { name: "Account balance", href: "#", Icon: ScaleIcon, amount: "$30,659.45" },
  { name: "Account balance", href: "#", Icon: ScaleIcon, amount: "$30,659.45" },

  // More items...
];

export type PageState = {};
const DashboardHome = () => {
  const {
    data: response,
    mutate,
    isValidating,
  } = useSWR(
    ["/api/clicks/graphics"],
    () => {
      return clicksService.getGraphicData({
        owner: "e2e1497d-4c41-4886-a8ad-86cfdd6e5e59",
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

  console.log({ response });
  return (
    <div className="flex flex-col w-full h-full">
      <DashboardHeader />
      {/* <div className="mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Overview
          </h2>
          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.name}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <card.Icon
                        className="h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {card.name}
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {card.amount}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a
                      href={card.href}
                      className="font-medium text-cyan-700 hover:text-cyan-900"
                    >
                      View all
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

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
            <span className="font-light">Clicks by day</span>
            <DashboardChart
              valueKeys={response.destinationNames}
              data={response.graphicData.by_destination_name.day_hour}
            />
          </div>

          <div className="flex flex-col justify-center items-center">
            <span className="font-light">Clicks by day</span>
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
