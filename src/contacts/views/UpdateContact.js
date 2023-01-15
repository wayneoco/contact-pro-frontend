import { useLocation } from "react-router-dom";

import ContactForm from "../components/ContactForm";

const UpdateContact = () => {
  const location = useLocation();
  const { contact } = location.state;

  const initialValues = {
    image: contact.image || "",
    firstName: contact.firstName || "",
    lastName: contact.lastName || "",
    jobTitle: contact.jobTitle || "",
    company: contact.company || "",
    email: contact.email || "",
    phoneMobile: contact.phoneMobile || "",
    website: contact.website || "",
    notes: contact.notes || "",
    favorite: contact.favorite || false,
    tags: contact.tags || "",
    ownerId: contact.ownerId,
    dateCreated: contact.dateCreated,
    dateModified: new Date(Date.now()),
  };

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Update {contact.fullName}
          </h1>
        </div>
      </header>
      <main className="m-8">
        <div className="mt-5 mx-auto max-w-2xl md:mt-0">
          <ContactForm
            method="PATCH"
            contactid={contact.id}
            initialValues={initialValues}
          />
        </div>
      </main>
    </>
  );
};

export default UpdateContact;
