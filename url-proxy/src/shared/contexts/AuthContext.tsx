import { useAuthStore } from "../state";
import { Hub, HubCallback } from "@aws-amplify/core";

import React, { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { Auth } from "aws-amplify";

export type AuthContextProps = {
  children: React.ReactNode;
};

const AuthContext = ({ children }: AuthContextProps) => {
  const authStore = useAuthStore();

  const updateUserState = useCallback((cognitoUser: any) => {
    if (!cognitoUser) {
      return authStore.setUser(null);
    }
    const {
      accessToken: { jwtToken },
    } = cognitoUser.signInUserSession;

    const {
      email,
      sub: id,
      email_verified: emailVerified,
    } = cognitoUser.attributes;
    authStore.setUser({
      id,
      email,
      emailVerified,
      jwtToken,
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
        const { attributes } = data.payload.data;

        console.log(data.payload.data);
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
