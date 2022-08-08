import { useAuthStore } from "../state";
import { Hub, HubCallback } from "@aws-amplify/core";

import React, { useEffect } from "react";
import { toast } from "react-toastify";

export type AuthContextProps = {
  children: React.ReactNode;
};

const AuthContext = ({ children }: AuthContextProps) => {
  const authStore = useAuthStore();

  const listener: HubCallback = (data) => {
    switch (data.payload.event) {
      case "signIn":
        const { attributes } = data.payload.data;

        const {
          accessToken: { jwtToken },
        } = data.payload.data.signInUserSession;

        const { email, sub: id, email_verified: emailVerified } = attributes;
        authStore.setUser({
          id,
          email,
          emailVerified,
          jwtToken,
        });

        break;
      case "signUp":
        break;
      case "signOut":
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
