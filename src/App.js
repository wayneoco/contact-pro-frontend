import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { UserContext } from "./shared/contexts/user-context";
import { ProtectedComponent } from "./shared/auth/protected-component";
import { useHttpClient } from "./shared/hooks/http-hook.js";
import MainHeader from "./shared/components/layout/MainHeader";
import UserProfile from "./users/views/UserProfile";
import Contacts from "./contacts/views/Contacts";
import ContactById from "./contacts/views/ContactById";
import NewContact from "./contacts/views/NewContact";
import UpdateContact from "./contacts/views/UpdateContact";
import Dashboard from "./contacts/views/Dashboard";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

const App = () => {
  const { user: auth0User, isLoading, getAccessTokenSilently } = useAuth0();
  const { sendRequest } = useHttpClient();
  const [loggedInUser, setLoggedInUser] = useState();
  const [token, setToken] = useState(null);

  const routes = (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route
        path="/profile"
        element={<ProtectedComponent component={UserProfile} />}
      />
      <Route
        path="/contacts/:contactId"
        element={<ProtectedComponent component={ContactById} />}
      />
      <Route
        path="/contacts/:contactId/update"
        element={<ProtectedComponent component={UpdateContact} />}
      />
      <Route
        path="/contacts/new"
        element={<ProtectedComponent component={NewContact} />}
      />
      <Route
        path="/contacts"
        element={<ProtectedComponent component={Contacts} />}
      />
    </Routes>
  );

  useEffect(() => {
    if (!auth0User) return;

    const domain = process.env.REACT_APP_AUTH0_DOMAIN;

    (async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        });
        setToken(accessToken);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [auth0User, getAccessTokenSilently, setToken]);

  useEffect(() => {
    if (!token) return;

    const body = JSON.stringify({
      firstName: auth0User.given_name,
      lastName: auth0User.family_name,
      email: auth0User.email,
      auth0Id: auth0User.sub,
      image: auth0User.picture || "",
      token: token,
    });

    const header = {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
    };

    (async () => {
      try {
        let response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/user`,
          "POST",
          body,
          header
        );

        if (response.status === 200) {
          response = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/user/${response.user.id}`,
            "PATCH",
            body,
            header
          );
        }
        setLoggedInUser(response.user);
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, [token, sendRequest, setLoggedInUser]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <UserContext.Provider
      value={{
        loggedInUser,
        setLoggedInUser,
        token,
      }}
    >
      <MainHeader />
      <main>{routes}</main>
    </UserContext.Provider>
  );
};

export default App;
