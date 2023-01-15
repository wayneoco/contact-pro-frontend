import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Grid from "@mui/material/Unstable_Grid2";
import StarIcon from "@mui/icons-material/Star";
import Typography from "@mui/material/Typography";
import { grey, green, yellow, red } from "@mui/material/colors";

import DashboardContactCard from "../components/DashboardContactCard";
import Login from "../../shared/components/UIElements/Login";
import { UserContext } from "../../shared/contexts/user-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_HOUR = 3600;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const MILLISECONDS_PER_DAY =
  MILLISECONDS_PER_SECOND * SECONDS_PER_HOUR * HOURS_PER_DAY;
const MILLISECONDS_PER_WEEK =
  MILLISECONDS_PER_SECOND * SECONDS_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK;

const Dashboard = () => {
  const { loggedInUser } = useContext(UserContext);
  const { isAuthenticated } = useAuth0();
  const [contacts, setContacts] = useState();
  const [todayContacts, setTodayContacts] = useState();
  const [overdueContacts, setOverdueContacts] = useState();
  const [thisWeekContacts, setThisWeekContacts] = useState();
  const [favoriteContacts, setFavoriteContacts] = useState();
  const [suggestedContacts, setSuggestedContacts] = useState();
  const { isLoading, sendRequest } = useHttpClient();
  let userContactFrequencySettings;

  const isToday = (contact) => {
    const { nextContact } = contact;

    if (!nextContact) return false;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const nextContactDate = new Date(nextContact);
    nextContactDate.setHours(0, 0, 0, 0);

    return currentDate.getTime() === nextContactDate.getTime();
  };

  const isThisWeek = (contact) => {
    const { lastContact, nextContact, contactFrequency } = contact;

    const currentDate = new Date();
    let nextContactDate;

    if (nextContact) {
      nextContactDate = new Date(nextContact);
      nextContactDate.setHours(0, 0, 0, 0);
    } else if (lastContact && contactFrequency) {
      const interval =
        userContactFrequencySettings[contactFrequency.toLowerCase()].number;
      const intervalInMilliseconds = interval * MILLISECONDS_PER_WEEK;
      const lastContactDate = new Date(lastContact);
      lastContactDate.setHours(0, 0, 0, 0);

      nextContactDate = new Date();
      nextContactDate.setTime(
        lastContactDate.getTime() + intervalInMilliseconds
      );
    } else if (!lastContact || !nextContact) {
      return false;
    }

    currentDate.setHours(0, 0, 0, 0);

    const differenceInTime = nextContactDate.getTime() - currentDate.getTime();
    const differenceInDays = differenceInTime / MILLISECONDS_PER_DAY;

    return differenceInDays > 0 && differenceInDays <= 7;
  };

  const isOverdue = (contact) => {
    const { nextContact } = contact;

    if (!nextContact) return false;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const nextContactDate = new Date(nextContact);
    nextContactDate.setHours(0, 0, 0, 0);

    return nextContactDate.getTime() < currentDate.getTime();
  };

  const isSuggested = (contact) => {
    const { lastContact, nextContact } = contact;

    if (nextContact) return;
    if (!lastContact) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastContactDate = new Date(lastContact);
    lastContactDate.setHours(0, 0, 0, 0);

    const differenceInTime = today.getTime() - lastContactDate.getTime();
    const differenceInWeeks = differenceInTime / MILLISECONDS_PER_WEEK;

    return differenceInWeeks >= 24;
  };

  useEffect(() => {
    console.log(loggedInUser);
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

  useEffect(() => {
    if (!loggedInUser || !contacts) return;

    userContactFrequencySettings = loggedInUser.settings.contactFrequency;

    const newTodayContacts = [];
    const newFavoriteContacts = [];
    const newThisWeekContacts = [];
    const newOverdueContacts = [];
    const newSuggestedContacts = [];

    contacts.forEach((contact) => {
      if (contact.favorite) newFavoriteContacts.push(contact);

      if (!contact.tracked) return;

      if (isToday(contact)) {
        newTodayContacts.push(contact);
      } else if (isOverdue(contact)) {
        newOverdueContacts.push(contact);
      } else if (isThisWeek(contact)) {
        newThisWeekContacts.push(contact);
      } else if (isSuggested(contact)) {
        newSuggestedContacts.push(contact);
      }
    });

    setTodayContacts(newTodayContacts);
    setFavoriteContacts(newFavoriteContacts);
    setThisWeekContacts(newThisWeekContacts);
    setOverdueContacts(newOverdueContacts);
    setSuggestedContacts(newSuggestedContacts);
  }, [contacts]);

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <Typography variant="h5" component="h2">
            Dashboard
          </Typography>
        </div>
      </header>
      <main className="my-8">
        {isAuthenticated && contacts && contacts.length > 0 && (
          <>
            <div className="mx-auto mb-20 max-w-7xl px-4 sm:px-6 lg:px-8">
              <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                Contact Today
              </Typography>
              {todayContacts && todayContacts.length > 0 ? (
                <Grid container gap={2}>
                  {todayContacts.map((contact) => {
                    return (
                      <DashboardContactCard
                        key={`${contact.firstName}-${contact.lastName}`}
                        contact={contact}
                        setContacts={setContacts}
                        borderColor={green[500]}
                      />
                    );
                  })}
                </Grid>
              ) : (
                todayContacts && (
                  <Typography variant="body2">
                    Looks like you're all caught up for today. Great job!
                  </Typography>
                )
              )}
            </div>
            <div className="mx-auto mb-20 max-w-7xl px-4 sm:px-6 lg:px-8">
              <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                Overdue Contacts
              </Typography>
              {overdueContacts && overdueContacts.length > 0 ? (
                <Grid container gap={2}>
                  {overdueContacts.map((contact) => {
                    return (
                      <DashboardContactCard
                        key={`${contact.firstName}-${contact.lastName}`}
                        contact={contact}
                        setContacts={setContacts}
                        borderColor={red[500]}
                      />
                    );
                  })}
                </Grid>
              ) : (
                overdueContacts && (
                  <Typography variant="body2">
                    You don't have any overdue contacts. Great job!
                  </Typography>
                )
              )}
            </div>
            <div className="mx-auto mb-20 max-w-7xl px-4 sm:px-6 lg:px-8">
              <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                Contact This Week
              </Typography>
              {thisWeekContacts && thisWeekContacts.length > 0 ? (
                <Grid container gap={2}>
                  {thisWeekContacts.map((contact) => {
                    return (
                      <DashboardContactCard
                        key={`${contact.firstName}-${contact.lastName}`}
                        contact={contact}
                        setContacts={setContacts}
                        borderColor={yellow[500]}
                      />
                    );
                  })}
                </Grid>
              ) : (
                thisWeekContacts && (
                  <Typography variant="body2">
                    Looks like you're all caught up for this week. Great job!
                  </Typography>
                )
              )}
            </div>
            <div className="mx-auto mb-20 max-w-7xl px-4 sm:px-6 lg:px-8">
              <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                Suggested Contacts
              </Typography>
              {suggestedContacts && suggestedContacts.length > 0 ? (
                <Grid container gap={2}>
                  {suggestedContacts.map((contact) => {
                    return (
                      <DashboardContactCard
                        key={`${contact.firstName}-${contact.lastName}`}
                        contact={contact}
                        setContacts={setContacts}
                        suggestedCard={true}
                      />
                    );
                  })}
                </Grid>
              ) : (
                suggestedContacts && (
                  <Typography variant="body2">
                    Looks like you're all caught up for this week. Great job!
                  </Typography>
                )
              )}
            </div>
            <div className="mx-auto mb-20 max-w-7xl px-4 sm:px-6 lg:px-8">
              <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                <StarIcon
                  sx={{
                    verticalAlign: "text-top",
                    fontSize: 28,
                    color: yellow[500],
                  }}
                />{" "}
                Favorite Contacts
              </Typography>
              {favoriteContacts && favoriteContacts.length > 0 ? (
                <Grid container gap={2}>
                  {favoriteContacts.map((contact) => {
                    return (
                      <DashboardContactCard
                        key={`${contact.firstName}-${contact.lastName}`}
                        contact={contact}
                        borderColor={grey[500]}
                        favoriteCard={true}
                      />
                    );
                  })}
                </Grid>
              ) : (
                favoriteContacts && (
                  <Typography variant="body1">
                    You haven't favorited any contacts yet.
                  </Typography>
                )
              )}
            </div>
          </>
        )}
        {isAuthenticated && contacts && contacts.length === 0 && (
          <div className="flex flex-col mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 text-center">
            <Typography variant="subtitle1" className="mx-auto">
              You haven't added any contacts yet.
            </Typography>
          </div>
        )}
        {!isAuthenticated && (
          <div className="flex flex-col mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 text-center">
            <Typography variant="subtitle1" className="mx-auto">
              Please log in or create an account.
            </Typography>
            <Login className="w-52" />
          </div>
        )}
      </main>
    </>
  );
};

export default Dashboard;
