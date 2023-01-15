import { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import grey from "@mui/material/colors/grey";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { UserContext } from "../../shared/contexts/user-context";
import DatePicker from "../../shared/components/UIElements/DatePicker";
import ContactFrequencySelect from "./ContactFrequencySelect";
import Item from "../../shared/components/layout/Item";

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_HOUR = 3600;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const MILLISECONDS_PER_WEEK =
  MILLISECONDS_PER_SECOND * SECONDS_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK;

const ContactRelationship = (props) => {
  const { contact } = props;
  const { lastContact, nextContact, contactFrequency } = contact;
  const { loggedInUser } = useContext(UserContext);
  const { sendRequest } = useHttpClient();
  const userContactFrequencySettings = loggedInUser.settings.contactFrequency;
  const [isTracked, setIsTracked] = useState(contact.tracked || false);
  const [lastCtc, setLastCtc] = useState(
    lastContact ? new Date(lastContact).toLocaleDateString() : null
  );
  const [nextCtc, setNextCtc] = useState(
    nextContact ? new Date(nextContact).toLocaleDateString() : null
  );
  const [ctcFrequency, setCtcFrequency] = useState(
    contactFrequency ? contactFrequency : null
  );
  const [ctcFrequencyInput, setCtcFrequencyInput] = useState("");

  const handleTrackRelationship = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/contacts/${contact.id}`,
        "PATCH",
        JSON.stringify({ tracked: !isTracked }),
        {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${loggedInUser.token}`,
        }
      );
    } catch (err) {
      alert(err);
    }

    setIsTracked(!isTracked);
  };

  const handleSetLastContact = async (event) => {
    const newValue = event ? event.$d : null;

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/contacts/${contact.id}`,
        "PATCH",
        JSON.stringify({ lastContact: newValue }),
        {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${loggedInUser.token}`,
        }
      );
    } catch (err) {
      alert(err);
    }

    setLastCtc(newValue);

    if (newValue && ctcFrequency) {
      autoSetNextContact(newValue);
    }
  };

  const handleClearLastContact = (event) => {
    event.stopPropagation();
    setLastCtc(lastContact || null);
  };

  const handleSetNextContact = async (event, newNextContact = null) => {
    let newValue;

    if (newNextContact) {
      newValue = newNextContact;
    } else {
      newValue = event ? event.$d : null;
    }

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/contacts/${contact.id}`,
        "PATCH",
        JSON.stringify({ nextContact: newValue }),
        {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${loggedInUser.token}`,
        }
      );
    } catch (err) {
      alert(err);
    }

    setNextCtc(newValue);
  };

  const handleClearNextContact = (event) => {
    event.stopPropagation();
    setNextCtc(nextContact || null);
  };

  const handleSetContactFrequency = async (event) => {
    const newValue = event.target.textContent;

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/contacts/${contact.id}`,
        "PATCH",
        JSON.stringify({ contactFrequency: newValue }),
        {
          "Content-Type": "application/json; charste=utf-8",
          Authorization: `Bearer ${loggedInUser.token}`,
        }
      );
    } catch (err) {
      alert(err);
    }

    setCtcFrequency(newValue);
    setCtcFrequencyInput(newValue);
    autoSetNextContact(lastCtc, newValue);
  };

  const handleClearCtcFrequency = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/contacts/${contact.id}`,
        "PATCH",
        JSON.stringify({ contactFrequency: null }),
        {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${loggedInUser.token}`,
        }
      );
    } catch (err) {
      alert(err);
    }

    setCtcFrequency(null);
    setCtcFrequencyInput("");
  };

  // automatically set nextContactDate when lastContactDate is set
  const autoSetNextContact = (lastContact, frequency = null) => {
    lastContact = lastContact || new Date();
    frequency = frequency || ctcFrequency;
    const lastContactDate = new Date(lastContact);
    lastContactDate.setHours(0, 0, 0, 0);

    const interval =
      userContactFrequencySettings[frequency.toLowerCase()].number;

    const intervalInMilliseconds = interval * MILLISECONDS_PER_WEEK;

    const newNextContactDate = new Date();
    newNextContactDate.setTime(
      lastContactDate.getTime() + intervalInMilliseconds
    );

    handleSetNextContact(null, newNextContactDate.toLocaleDateString());
  };

  return (
    <Grid container sx={{ flexGrow: 1 }} spacing={4}>
      <Grid sx={{ width: "100%" }}>
        <Item sx={{ mt: 0, p: 0 }}>
          <Box sx={{ mb: 2, p: "0.5", bgcolor: grey[50] }}>
            <Grid>
              <Typography variant="subtitle1" component="h3">
                Relationship
              </Typography>
            </Grid>
          </Box>
          <Box sx={{ mt: 1, p: 1 }}>
            <Grid
              container
              sx={{
                display: "flex",
                gap: "10px",
                ml: 1,
                mb: 1,
                p: 1,
                with: "320px",
              }}
            >
              <Grid sx={{ m: 0, p: 0 }}>Track relationship?</Grid>
              <Grid sx={{ m: 0, p: 0 }}>
                <Switch
                  size="small"
                  onChange={handleTrackRelationship}
                  checked={isTracked}
                  value={isTracked}
                />
              </Grid>
            </Grid>
            {isTracked ? (
              <>
                <Grid
                  container
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    ml: 1,
                    mb: 1,
                    p: 1,
                    width: "320px",
                  }}
                >
                  <Grid sx={{ m: 0, p: 0 }}>Contact frequency:</Grid>
                  <Grid sx={{ m: 0, p: 0 }}>
                    <ContactFrequencySelect
                      value={ctcFrequency}
                      setValue={setCtcFrequency}
                      inputValue={ctcFrequencyInput}
                      setInputValue={setCtcFrequencyInput}
                      clearInputHandler={handleClearCtcFrequency}
                      frequencies={userContactFrequencySettings}
                      onChange={handleSetContactFrequency}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    ml: 1,
                    mb: 1,
                    p: 1,
                    width: "320px",
                  }}
                >
                  <Grid sx={{ m: 0, p: 0 }}>Last contacted:</Grid>
                  <Grid sx={{ m: 0, p: 0 }}>
                    <DatePicker
                      maxDate={new Date()}
                      sx={{ m: 0, p: 0 }}
                      value={lastCtc}
                      setValue={setLastCtc}
                      onChange={handleSetLastContact}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    ml: 1,
                    mb: 1,
                    p: 1,
                    width: "320px",
                  }}
                >
                  <Grid sx={{ m: 0, p: 0 }}>Next contact:</Grid>
                  <Grid sx={{ m: 0, p: 0 }}>
                    <DatePicker
                      minDate={new Date()}
                      sx={{ m: 0, p: 0 }}
                      value={nextCtc}
                      setValue={setNextCtc}
                      onChange={handleSetNextContact}
                    />
                  </Grid>
                </Grid>
              </>
            ) : null}
          </Box>
        </Item>
      </Grid>
    </Grid>
  );
};

export default ContactRelationship;
