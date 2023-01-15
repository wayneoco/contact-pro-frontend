import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

import {
  TextInput,
  TextAreaInput,
  URLInput,
  ImageUpload,
} from "../../shared/components/FormElements/FormElements";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { UserContext } from "../../shared/contexts/user-context";
import TagSelect from "./TagSelect";

const REGEX = {
  phone: new RegExp(/\d{3}-\d{3}-\d{4}$/),
  url: new RegExp(
    `(www.)?[a-z0-9]+(.[a-z]{2,}){1,3}(#?/?[a-zA-Z0-9#]+)*/?([a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$`
  ),
};

const ContactForm = (props) => {
  const [isContactAdded, setContactedAdded] = useState(false);
  const { sendRequest } = useHttpClient();
  const { loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email"),
    phoneMobile: Yup.string().matches(
      REGEX.phone,
      "Invalid phone number (must be in the form 555-555-5555)."
    ),
    website: Yup.string().matches(
      REGEX.url,
      "Invalid URL (valid examples: www.example.com or example.com)"
    ),
  });

  const handleSubmit = async (values, setSubmitting) => {
    const formData = new FormData();
    const valueKeys = Object.keys(props.initialValues);

    for (const value of valueKeys) {
      if (value !== "tags") {
        formData.append(value, values[value]);
      } else {
        formData.append("tags", JSON.stringify(values["tags"]));
      }
    }

    let path;
    let successMessage;

    if (props.method === "POST") {
      path = "contacts";
      successMessage = "Contact has been added!";
    } else if (props.method === "PATCH") {
      path = `contacts/${props.contactid}`;
      successMessage = "Contact has been updated!";
    }

    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/${path}`,
        props.method,
        formData,
        {
          Authorization: `Bearer ${loggedInUser.token}`,
        }
      );
      setSubmitting(false);
      alert(successMessage);
      navigate(`/contacts/${response.contact.id}`);
    } catch (err) {
      alert(err);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    navigate(-1);
  };

  return (
    <Formik
      initialValues={props.initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        handleSubmit(values, setSubmitting);
      }}
    >
      {({ isSubmitting }) => (
        <Form action="#" method="POST">
          <div className="shadow sm:overflow-hidden sm:rounded-md">
            <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <ImageUpload
                    image={props.initialValues.image}
                    label="Photo"
                    name="image"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                  />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <TextInput label="First name" name="firstName" type="text" />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <TextInput label="Last name" name="lastName" type="text" />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <TextInput label="Job Title" name="jobTitle" type="text" />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <TextInput label="Company" name="company" type="text" />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <TextInput label="Email address" name="email" type="text" />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <TextInput
                    label="Phone (mobile)"
                    name="phoneMobile"
                    type="tel"
                  />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <TagSelect
                    name="tags"
                    initialtags={props.initialValues.tags}
                  />
                </div>

                <div className="col-span-3 sm:col-span-2">
                  <URLInput
                    label="Website"
                    name="website"
                    type="text"
                    placeholder="www.example.com"
                  />
                </div>

                <br />

                <div className="col-span-6 sm:col-span-4">
                  <TextAreaInput
                    label="Notes"
                    name="notes"
                    type="textarea"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
              <button
                id="submit"
                type="submit"
                className={`inline-flex justify-center mr-5 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm enabled:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                disabled={isSubmitting}
              >
                Save
              </button>
              <button
                id="cancel"
                type="button"
                className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm enabled:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ContactForm;
