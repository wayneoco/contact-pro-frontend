import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import DoneIcon from "@mui/icons-material/Done";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { CalendarPicker } from "@mui/x-date-pickers/CalendarPicker";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import Modal from "@mui/material/Modal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { grey, green, yellow, red } from "@mui/material/colors";

import Icons from "./Icons";
import { UserContext } from "../../shared/contexts/user-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_HOUR = 3600;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const MILLISECONDS_PER_WEEK =
  MILLISECONDS_PER_SECOND * SECONDS_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const DashboardContactCard = (props) => {
  const {
    id,
    token,
    image,
    firstName,
    lastName,
    jobTitle,
    company,
    phoneMobile,
    email,
    tags,
    lastContact,
    nextContact,
    contactFrequency,
  } = props.contact;
  const { borderColor, favoriteCard, suggestedCard, setContacts } = props;
  const { sendRequest } = useHttpClient();
  const { loggedInUser } = useContext(UserContext);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const userContactFrequencySettings = loggedInUser.settings.contactFrequency;
  const openMenu = Boolean(menuAnchorEl);

  const getSubheader = () => {
    if (favoriteCard) {
      return jobTitle ? `${jobTitle}, ${company}` : "";
    } else if (suggestedCard) {
      return lastContact
        ? `Last contact: ${new Date(lastContact).toLocaleDateString()}`
        : "Last contact: (not recorded)";
    } else {
      return nextContact
        ? `Next contact: ${new Date(nextContact).toLocaleDateString()}`
        : "Next contact: (not set)";
    }
  };

  const isNextContactDateBeforeToday = (nextContactDate) => {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();
    const nextYear = nextContactDate.getFullYear();
    const nextMonth = nextContactDate.getMonth();
    const nextDate = nextContactDate.getDate();

    return (
      nextYear < todayYear ||
      (nextYear === todayYear && nextMonth < todayMonth) ||
      (nextYear === todayYear &&
        nextMonth === todayMonth &&
        nextDate < todayDate)
    );
  };

  const setNextContactDate = (lastContactDate) => {
    let nextContactDate;

    const interval =
      userContactFrequencySettings[
        contactFrequency ? contactFrequency.toLowerCase() : "occasional"
      ].number;
    const intervalInMilliseconds = interval * MILLISECONDS_PER_WEEK;

    nextContactDate = new Date();
    nextContactDate.setTime(lastContactDate.getTime() + intervalInMilliseconds);

    while (isNextContactDateBeforeToday(nextContactDate)) {
      nextContactDate.setTime(
        nextContactDate.getTime() + intervalInMilliseconds
      );
    }

    return nextContactDate;
  };

  const updateContacts = (updatedContact) => {
    setContacts((prevState) => {
      const contactIndex = prevState.findIndex((contact) => contact.id === id);

      const newState = prevState.slice();
      newState.splice(contactIndex, 1, updatedContact);

      return newState;
    });
  };

  const handleMarkDone = async () => {
    const lastContactDate = new Date();
    lastContactDate.setHours(0, 0, 0, 0);
    const nextContactDate = setNextContactDate(lastContactDate) || null;

    try {
      const updatedContact = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/contacts/${id}`,
        "PATCH",
        JSON.stringify({
          lastContact: lastContactDate,
          nextContact: nextContactDate,
        }),
        {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`,
        }
      );
      updateContacts(updatedContact.contact);
    } catch (err) {
      alert(err);
    }
  };

  const handleRescheduleOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleRescheduleClose = () => {
    setMenuAnchorEl(null);
  };

  const handleRescheduleDate = async (event) => {
    const newValue = event
      ? event.$d
      : setNextContactDate(new Date(nextContact));

    try {
      const updatedContact = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/contacts/${id}`,
        "PATCH",
        JSON.stringify({ nextContact: newValue }),
        {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`,
        }
      );
      updateContacts(updatedContact.contact);
    } catch (err) {
      alert(err);
    }

    handleCloseModal();
    handleRescheduleClose();
  };

  const handleStopTracking = async () => {
    try {
      const updatedContact = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/contacts/${id}`,
        "PATCH",
        JSON.stringify({ tracked: false }),
        {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`,
        }
      );
      updateContacts(updatedContact.contact);
    } catch (err) {
      alert(err);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    handleRescheduleClose();
  };

  return (
    <Grid>
      <Card sx={{ minWidth: 345, maxWidth: 345 }}>
        <CardHeader
          avatar={
            image ? (
              <Link to={`/contacts/${id}`}>
                <Avatar
                  src={`${process.env.REACT_APP_BASE_URL}/${image}`}
                  sx={{ mx: "auto", width: 42, height: 42 }}
                />
              </Link>
            ) : (
              <Link to={`/contacts/${id}`}>
                <Avatar
                  sx={{
                    mx: "auto",
                    fontSize: 22,
                    width: 42,
                    height: 42,
                  }}
                >
                  {firstName[0].toUpperCase() + lastName[0].toUpperCase()}
                </Avatar>
              </Link>
            )
          }
          title={
            <Link to={`/contacts/${id}`}>{firstName + " " + lastName}</Link>
          }
          // subheader={jobTitle + (company ? ", " + company : "")}
          subheader={getSubheader()}
          subheaderTypographyProps={{
            fontStyle: "italic",
          }}
          sx={{ borderTop: 8, borderColor: borderColor }}
        />
        <Divider variant="middle" />
        <CardContent sx={{ pb: 1 }}>
          <Grid container sx={{ p: 0 }}>
            <Grid xs={1} sx={{ verticalAlign: "unset" }}>
              {Icons.phoneMobile}
            </Grid>
            <Grid
              sx={{
                pl: 2,
                justifyContent: "flex-start",
                color: grey[800],
              }}
            >
              {phoneMobile && (
                <Typography variant="body2">
                  <a href={`tel:${phoneMobile}`}>{phoneMobile}</a>
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid container sx={{ p: 0 }}>
            <Grid xs={1}>{Icons.email}</Grid>
            <Grid
              sx={{
                pl: 2,
                justifyContent: "flex-start",
                color: grey[800],
              }}
            >
              {email && (
                <Typography variant="body2">
                  <a href={`mailto:${email}`}>{email}</a>
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid container sx={{ p: 0 }}>
            <Grid xs={1} sx={{ verticalAlign: "unset" }}>
              {Icons.tags}
            </Grid>
            <Grid
              sx={{
                pl: 2,
                justifyContent: "flex-start",
                color: grey[800],
              }}
            >
              {tags.length > 0 && (
                <Typography variant="body2">
                  {tags.map((tag) => {
                    return (
                      <span
                        key={`tag-${tag.title}`}
                        className="after:content-[',_'] last:after:content-none"
                      >
                        {tag.title}
                      </span>
                    );
                  })}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid container sx={{ p: 0 }}>
            <Grid xs={1} sx={{ verticalAlign: "unset" }}>
              {Icons.contactFrequency}
            </Grid>
            <Grid
              sx={{
                pl: 2,
                justifyContent: "flex-start",
                color: grey[800],
              }}
            >
              {contactFrequency && (
                <Typography variant="body2">
                  {contactFrequency} (every{" "}
                  {
                    userContactFrequencySettings[contactFrequency.toLowerCase()]
                      .number
                  }{" "}
                  weeks)
                </Typography>
              )}
            </Grid>
          </Grid>
          {!favoriteCard && (
            <Grid container sx={{ justifyContent: "flex-end", p: 0 }}>
              <Grid>
                <Tooltip title="Mark as done">
                  <IconButton onClick={handleMarkDone}>
                    <DoneIcon
                      fontSize="small"
                      sx={{
                        color: grey[400],
                        "&:hover": { color: green[500] },
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid>
                <Tooltip title="Reschedule">
                  <IconButton onClick={handleRescheduleOpen}>
                    <CalendarMonthIcon
                      fontSize="small"
                      sx={{
                        color: grey[400],
                        "&:hover": { color: yellow[500] },
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="reschedule-menu"
                  anchorEl={menuAnchorEl}
                  open={openMenu}
                  onClose={handleRescheduleClose}
                >
                  <MenuItem
                    id="auto-set-date"
                    onClick={() => handleRescheduleDate()}
                  >
                    <Typography variant="body2">
                      Set to next interval date
                    </Typography>
                  </MenuItem>
                  <MenuItem id="choose-date" onClick={handleOpenModal}>
                    <Typography variant="body2">Choose date</Typography>
                  </MenuItem>
                  <Modal open={openModal} onClose={handleCloseModal}>
                    <Box sx={style}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <CalendarPicker
                          disablePast
                          onChange={handleRescheduleDate}
                        />
                      </LocalizationProvider>
                    </Box>
                  </Modal>
                </Menu>
              </Grid>
              <Grid>
                <Tooltip title="Stop tracking">
                  <IconButton onClick={handleStopTracking}>
                    <CancelIcon
                      fontSize="small"
                      sx={{ color: grey[400], "&:hover": { color: red[500] } }}
                    />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default DashboardContactCard;
