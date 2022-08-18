import { Redirect } from "../../src/entities/Redirect";
import { REDIRECT_STRATEGIES } from "../../src/enum";
import { RedirectsService } from "../../src/services/redirects";

const destinations = [
  {
    url: "http://localhost:3000/search?q=1",
    name: "Ex1",
  },
  {
    url: "http://localhost:3000/search?q=2",
    name: "EX2",
  },
];

const redirectsService = new RedirectsService();

const validateRedirect = (sourceUrl: string, destination: string) => {
  console.debug(`==> going to ${sourceUrl}`);
  cy.visit(sourceUrl, {
    failOnStatusCode: false,
  })
    .url({
      timeout: 10000,
    })
    .should("eq", destination);
};

describe("Destinations", () => {
  beforeEach(() => {
    cy.loginByCognitoApi(
      Cypress.env("cognitoUsername"),
      Cypress.env("cognitoPassword")
    );
  });

  describe(`${REDIRECT_STRATEGIES.clicksPerDestination.label} Strategy`, () => {
    let createdRedirection: Redirect | null = null;
    const maxClicksPerDestination = 2;

    before(() => {
      const body = {
        name: REDIRECT_STRATEGIES.clicksPerDestination.label,
        strategy: REDIRECT_STRATEGIES.clicksPerDestination.id,
        destinations,
        owner: Cypress.env("cognitoUserId"),
        maxClicksPerDestination,
      };
      cy.request("POST", "/api/redirects", body).then((response) => {
        createdRedirection = response.body;
      });
    });

    it("must render the destinations", () => {
      cy.visit(
        `/redirects/${createdRedirection!.id}/destinations?redirectSource=${
          createdRedirection!.name
        }`
      );
      cy.get(".TableBody")
        .find("tr")
        .should("have.length", createdRedirection!.destinations!.length);
    });

    it("must redirect correctly", () => {
      const shareUrl = redirectsService.getShareUrl(
        createdRedirection!.id as string
      );

      cy.wrap("")
        .then(() => {
          console.debug("==> execution 1");
          return validateRedirect(shareUrl, destinations[0].url);
        })
        .then(() => {
          console.debug("==> execution 2");
          return validateRedirect(shareUrl, destinations[0].url);
        })
        .then(() => {
          console.debug("==> execution 3");
          return validateRedirect(shareUrl, destinations[1].url);
        });
    });

    after(() => {
      cy.visit("/");
      cy.request(
        "DELETE",
        `/api/redirects/${createdRedirection!.id as string}`
      );
    });
  });
  describe(`${REDIRECT_STRATEGIES.uniqueClicksPerDestination.label} Strategy`, () => {
    let createdRedirection: Redirect | null = null;

    before(() => {
      const body = {
        name: REDIRECT_STRATEGIES.uniqueClicksPerDestination.label,
        strategy: REDIRECT_STRATEGIES.uniqueClicksPerDestination.id,
        destinations,
        owner: Cypress.env("cognitoUserId"),
        maxClicksPerDestination: 1,
      };
      cy.request("POST", "/api/redirects", body).then((response) => {
        createdRedirection = response.body;
      });
    });

    it("must render the destinations", () => {
      cy.visit(
        `/redirects/${createdRedirection!.id}/destinations?redirectSource=${
          createdRedirection!.name
        }`
      );
      cy.get(".TableBody")
        .find("tr")
        .should("have.length", createdRedirection!.destinations!.length);
    });

    it("must redirect correctly", () => {
      const shareUrl = redirectsService.getShareUrl(
        createdRedirection!.id as string
      );

      cy.wrap(REDIRECT_STRATEGIES.uniqueClicksPerDestination.id)
        .then(() => {
          console.debug("==> execution 1");
          return validateRedirect(shareUrl, destinations[0].url);
        })
        .then(() => {
          console.debug("==> execution 2");
          return validateRedirect(shareUrl, destinations[0].url);
        });
    });

    after(() => {
      cy.visit("/");
      cy.request(
        "DELETE",
        `/api/redirects/${createdRedirection!.id as string}`
      );
    });
  });
});

export {};
