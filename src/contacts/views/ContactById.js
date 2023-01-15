import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { UserContext } from "../../shared/contexts/user-context";
import ContactCard from "../components/ContactCard";

const ContactById = () => {
  const { loggedInUser } = useContext(UserContext);
  const { isLoading, sendRequest } = useHttpClient();
  const [contact, setContact] = useState();
  const contactId = useParams().contactId;

  useEffect(() => {
    (async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/contacts/${contactId}`,
          "GET",
          {},
          {
            Authorization: `Bearer ${loggedInUser.token}`,
          }
        );
        setContact(response.contact);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [contactId]);

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {!isLoading && contact && contact.fullName}
          </h1>
        </div>
      </header>
      <main className="my-8">
        {!isLoading && contact && (
          <>
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <ContactCard contact={contact} />
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default ContactById;
