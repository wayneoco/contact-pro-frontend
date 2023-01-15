import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Menu, MenuItem } from "@mui/material";

const ContactsTableToolbar = (props) => {
  const { numSelected, tableName, tags, setFilteredTag } = props;
  const [isFiltered, setIsFiltered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [tagTitle, setTagTitle] = useState("");
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTagSelect = (event) => {
    if (event.target.id === "all-tags") {
      setFilteredTag(null);
      setTagTitle("");
      setIsFiltered(false);
    } else {
      setFilteredTag(event.target.id);
      setTagTitle(event.target.id);
      setIsFiltered(true);
    }
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {isFiltered
            ? `${tagTitle[0].toUpperCase() + tagTitle.slice(1)}`
            : tableName}
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip title="Filter list">
            <IconButton id="filter-button" onClick={handleMenuOpen}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="filter-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem
              key="all-tags"
              id="all-tags"
              sx={{ fontSize: "12px" }}
              onClick={handleTagSelect}
            >
              All Tags
            </MenuItem>
            <MenuItem
              key="favorites"
              id="favorites"
              sx={{ fontSize: "12px" }}
              onClick={handleTagSelect}
            >
              Favorites
            </MenuItem>
            {tags.map((tag) => {
              return (
                <MenuItem
                  key={tag}
                  id={tag}
                  sx={{ fontSize: "12px" }}
                  onClick={handleTagSelect}
                >
                  {tag[0].toUpperCase() + tag.slice(1)}
                </MenuItem>
              );
            })}
          </Menu>
        </>
      )}
    </Toolbar>
  );
};

ContactsTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default ContactsTableToolbar;
