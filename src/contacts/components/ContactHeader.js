import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Unstable_Grid2";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import StarIcon from "@mui/icons-material/Star";
import Typography from "@mui/material/Typography";
import grey from "@mui/material/colors/grey";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { UserContext } from "../../shared/contexts/user-context";
import DeleteConfirmationModal from "../../shared/components/UIElements/DeleteConfirmationModal";

const ContactHeader = (props) => {
  const contact = props.contact;
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFavorite, setFavorite] = useState(contact.favorite);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const menuOpen = Boolean(anchorEl);
  const navigate = useNavigate();
  const { sendRequest } = useHttpClient();
  const { loggedInUser } = useContext(UserContext);

  const starIconColors = {
    true: "#ffeb3b",
    false: "#e0e0e0",
  };

  const handleStarClick = async () => {
    setFavorite(!isFavorite);

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/contacts/${contact.id}`,
        "PATCH",
        JSON.stringify({ favorite: !isFavorite }),
        {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${loggedInUser.token}`,
        }
      );
    } catch (err) {
      alert(err);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteModalOpen = (event) => {
    event.preventDefault();
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setAnchorEl(null);
  };

  const handleDelete = async (event) => {
    event.preventDefault();

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/contacts/${contact.id}`,
        "DELETE",
        {
          Authorization: `Bearer ${loggedInUser.token}`,
        }
      );
      handleDeleteModalClose();
      navigate("/contacts");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Grid xs={12}>
      {contact.image ? (
        <Avatar
          src={`${process.env.REACT_APP_BASE_URL}/${contact.image}`}
          sx={{ mx: "auto", width: 180, height: 180 }}
        />
      ) : (
        <Avatar sx={{ mx: "auto", fontSize: 72, width: 180, height: 180 }}>
          {contact.firstName[0].toUpperCase() +
            contact.lastName[0].toUpperCase()}
        </Avatar>
      )}
      <Grid container spacing={0}>
        <Grid
          xs={12}
          sx={{
            mx: "auto",
            fontSize: 18,
            fontWeight: "medium",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" component="h2">
            {contact.fullName}
          </Typography>
        </Grid>
        <Grid
          xs={12}
          sx={{
            mx: "auto",
            fontSize: 14,
            fontWeight: "light",
            textAlign: "center",
          }}
        >
          <Typography variant="subtitle1">{contact.jobTitle}</Typography>
        </Grid>
        <Grid
          xs={12}
          sx={{
            mx: "auto",
            fontSize: 14,
            fontWeight: "light",
            textAlign: "center",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "light" }}>
            {contact.company}
          </Typography>
        </Grid>
        <Grid sx={{ mx: "auto", mt: 1 }}>
          <div className="flex justify-center pb-1 pr-3">
            <IconButton
              id="star-icon"
              sx={{
                pr: 0,
                py: 0,
                pl: 1.8,
                "&:hover": { bgcolor: "inherit" },
              }}
              onClick={handleStarClick}
            >
              <StarIcon
                fontSize="small"
                sx={{
                  color: starIconColors[isFavorite],
                  "&:hover": { fill: grey[400] },
                }}
              />
            </IconButton>
            <IconButton
              id="contact-menu-button"
              aria-controls={menuOpen ? "contact-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? "true" : undefined}
              sx={{
                pl: 0,
                py: 0,
                pr: 0.2,
                "&:hover": { bgcolor: "inherit" },
              }}
              onClick={handleMenuClick}
            >
              <MoreHorizIcon
                fontSize="small"
                sx={{ color: grey[500], "&:hover": { fill: grey[400] } }}
              />
            </IconButton>
            <Menu
              id="contact-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              MenuListProps={{
                "aria-labelledby": "contact-menu-button",
              }}
            >
              <Link
                to={`/contacts/${props.contact.id}/update`}
                state={{ contact: contact }}
              >
                <MenuItem sx={{ fontSize: 12 }} onClick={handleMenuClose}>
                  Edit
                </MenuItem>
              </Link>
              <Link to="#" onClick={handleDeleteModalOpen}>
                <MenuItem sx={{ fontSize: 12 }}>Delete</MenuItem>
              </Link>
              <DeleteConfirmationModal
                open={deleteModalOpen}
                handleDelete={handleDelete}
                handleModalClose={handleDeleteModalClose}
                contact={contact}
              />
            </Menu>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ContactHeader;
