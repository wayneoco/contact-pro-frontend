import React from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";

import LoadingSpinner from "../components/UIElements/LoadingSpinner";

export const ProtectedComponent = ({ component }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <LoadingSpinner />,
  });

  return <Component />;
};
