import { useAuth0 } from "@auth0/auth0-react";

import ContactForm from "../components/ContactForm";

const NewContact = () => {
  const { user } = useAuth0();

  const initialValues = {
    image: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
    company: "",
    email: "",
    phoneMobile: "",
    website: "",
    notes: "",
    favorite: false,
    tags: [],
    dateCreated: new Date(Date.now()),
    dateModified: new Date(Date.now()),
    ownerAuth0Id: user.sub,
  };

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Add New Contact
          </h1>
        </div>
      </header>
      <main className="m-8">
        <div className="mt-5 mx-auto max-w-2xl md:mt-0">
          <ContactForm method="POST" initialValues={initialValues} />
        </div>
      </main>
    </>
  );
};

export default NewContact;
