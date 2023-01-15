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

const UserProfileHeader = (props) => {
  const user = props.user;
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const navigate = useNavigate();
  const { sendRequest } = useHttpClient();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid xs={12}>
      {user.image ? (
        <Avatar
          src={
            user.image.startsWith("http")
              ? user.image
              : `${process.env.REACT_APP_BASE_URL}/${user.image}`
          }
          sx={{ mx: "auto", width: 180, height: 180 }}
        />
      ) : (
        user.firstName &&
        user.lastName && (
          <Avatar sx={{ mx: "auto", fontSize: 72, width: 180, height: 180 }}>
            {user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()}
          </Avatar>
        )
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
          {user.fullName && (
            <Typography variant="h4" component="h2">
              {user.fullName}
            </Typography>
          )}
        </Grid>
        <Grid sx={{ mx: "auto", mt: 1 }}>
          <div className="flex justify-center pb-1 pr-3">
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
              <Link to={`/user/${props.user.id}/update`} state={{ user: user }}>
                <MenuItem sx={{ fontSize: 12 }} onClick={handleMenuClose}>
                  Edit
                </MenuItem>
              </Link>
            </Menu>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserProfileHeader;
