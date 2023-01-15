import { useState, useEffect, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { UserContext } from "../../shared/contexts/user-context";
import ContactsTable from "../components/ContactsTable";

const Contacts = () => {
  const { loggedInUser } = useContext(UserContext);
  const { isLoading, sendRequest } = useHttpClient();
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (!loggedInUser) return;

    (async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/contacts/user/${loggedInUser.id}`,
          "GET",
          {},
          {
            Authorization: `Bearer ${loggedInUser.token}`,
          }
        );
        setContacts(response.contacts);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [loggedInUser]);

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Contacts
          </h1>
        </div>
      </header>
      <main className="my-8">
        {!isLoading && contacts && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ContactsTable tableName="All Contacts" contacts={contacts} />
          </div>
        )}
      </main>
    </>
  );
};

export default Contacts;
