import { useAuthStore } from "../state";
import { Hub, HubCallback } from "@aws-amplify/core";

import React, { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { Auth } from "aws-amplify";
import get from "lodash/get";

export type AuthContextProps = {
  children: React.ReactNode;
};

const AuthContext = ({ children }: AuthContextProps) => {
  const authStore = useAuthStore();

  const updateUserState = useCallback((cognitoUser: any) => {
    if (!cognitoUser) {
      return authStore.setUser(null);
    }

    const jwtToken = get(
      cognitoUser,
      "signInUserSession.accessToken.jwtToken",
      ""
    );
    const email = get(cognitoUser, "attributes.email", "");
    const id = get(
      cognitoUser,
      "attributes.sub",
      get(cognitoUser, "username", "")
    );
    const emailVerified = get(cognitoUser, "attributes.email_verified", true);
    const roles = get(
      cognitoUser,
      "signInUserSession.accessToken.payload.cognito:groups",
      []
    );

    console.debug("updating user state", cognitoUser, roles);
    authStore.setUser({
      id,
      email,
      emailVerified,
      jwtToken,
      roles,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function recognizeState() {
      await Auth.currentAuthenticatedUser()
        .then(updateUserState)
        .catch((err) => console.error("currentAuthenticatedUser error", err));
    }

    recognizeState();
  }, [updateUserState]);

  const listener: HubCallback = (data) => {
    switch (data.payload.event) {
      case "signIn":
        console.info("user sign in", data.payload.data);
        updateUserState(data.payload.data);

        break;
      case "signUp":
        break;
      case "signOut":
        console.info("user sign out");
        authStore.setUser(null);
        break;
      case "signIn_failure":
        toast("Invalid credentials", {
          type: "error",
        });
        console.info("user sign in failed", data.payload.data);
        break;
      case "tokenRefresh":
        console.info("token refresh succeeded", data.payload.data);
        break;
      case "tokenRefresh_failure":
        toast("Error during revalidation of authentication", {
          type: "error",
        });
        console.info("token refresh failed", data.payload.data);
        break;
      case "configured":
        console.info("the Auth module is configured");
    }
  };
  useEffect(() => {
    Hub.listen("auth", listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
};

export default AuthContext;
