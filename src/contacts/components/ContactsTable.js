import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import StarIcon from "@mui/icons-material/Star";
import Avatar from "@mui/material/Avatar";
import grey from "@mui/material/colors/grey";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { UserContext } from "../../shared/contexts/user-context";
import ContactsTableHead from "./ContactsTableHead";
import ContactsTableToolbar from "./ContactsTableToolbar";

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "phoneMobile",
    numeric: false,
    disablePadding: false,
    label: "Phone (mobile)",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "tags",
    numeric: false,
    disablePadding: false,
    label: "Tags",
  },
  {
    id: "moreIcon",
    numeric: false,
    disablePadding: false,
    label: "",
  },
];

const ContactsTable = (props) => {
  const { loggedInUser } = useContext(UserContext);
  const contacts = props.contacts;
  const [currentHover, setCurrentHover] = useState();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selected, setSelected] = useState([]);
  const [favorited, setFavorited] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const { sendRequest } = useHttpClient();
  const tags = loggedInUser.tags.map((tag) => tag.title);
  const [filteredTag, setFilteredTag] = useState(null);
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [isFiltered, setIsFiltered] = useState(false);
  const navigate = useNavigate();

  const starIconColors = {
    true: "#ffeb3b",
    false: "#eeeeee",
  };

  const descendingComparator = (a, b, orderBy) => {
    orderBy = orderBy === "name" ? "lastName" : orderBy;

    [a, b] =
      orderBy === "name"
        ? [a.lastName.toLowerCase(), b.lastName.toLowerCase()]
        : [a[orderBy], b[orderBy]];

    if (b < a) {
      return -1;
    }
    if (b > a) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleStarClick = async (event, contact) => {
    event.stopPropagation();

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/contacts/${contact.id}`,
        "PATCH",
        JSON.stringify({ favorite: !contact.favorite }),
        {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${loggedInUser.token}`,
        }
      );

      const favoritedIndex = favorited.indexOf(contact.id);
      let newFavorited = [];

      if (favoritedIndex === -1) {
        newFavorited = newFavorited.concat(favorited, contact.id);
      } else if (favoritedIndex === 0) {
        newFavorited = newFavorited.concat(favorited.slice(1));
      } else if (favoritedIndex === favorited.length - 1) {
        newFavorited = newFavorited.concat(favorited.slice(0, -1));
      } else if (favoritedIndex > 0) {
        newFavorited = newFavorited.concat(
          favorited.slice(0, favoritedIndex),
          favorited.slice(favoritedIndex + 1)
        );
      }

      setFavorited(newFavorited);
    } catch (err) {
      alert(err);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = contacts.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleRowClick = (event, id) => {
    event.stopPropagation();
    navigate(`/contacts/${id}`);
  };

  const handleCheckboxClick = (event, id) => {
    event.stopPropagation();
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleEmailClick = (event) => {
    event.stopPropagation();
  };

  const handlePhoneClick = (event) => {
    event.stopPropagation();
  };

  const handleOnMouseEnter = (event) => {
    setCurrentHover(event.currentTarget.attributes.id.value);
  };

  const handleOnMouseLeave = () => {
    setCurrentHover(null);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const isFavorited = (id) => favorited.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - contacts.length) : 0;

  const getFavorites = () => {
    const newFavorited = [];
    contacts.map(({ id, favorite }) => {
      if (favorite) newFavorited.push(id);
    });
    return newFavorited;
  };

  useEffect(() => {
    setFavorited(getFavorites());
  }, [contacts]);

  useEffect(() => {
    let newFilteredContacts;

    if (!filteredTag) {
      newFilteredContacts = contacts;
    } else if (filteredTag === "favorites") {
      newFilteredContacts = contacts.filter(({ favorite }) => favorite);
    } else {
      newFilteredContacts = contacts.filter(({ tags }) => {
        for (let i = 0; i < tags.length; i += 1) {
          if (tags[i].title === filteredTag) {
            return true;
          }
        }
        return false;
      });
    }

    setFilteredContacts(newFilteredContacts);
  }, [filteredTag, contacts]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <ContactsTableToolbar
          tableName={props.tableName}
          tags={tags}
          setFilteredTag={setFilteredTag}
          setIsFiltered={setIsFiltered}
          numSelected={selected.length}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <ContactsTableHead
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={contacts.length}
            />
            <TableBody>
              {filteredContacts
                .slice()
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((contact, index) => {
                  const isItemSelected = isSelected(contact.id);
                  const isFavorite = contact.favorite;
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleRowClick(event, contact.id)}
                      onMouseEnter={handleOnMouseEnter}
                      onMouseLeave={handleOnMouseLeave}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={contact.id}
                      id={contact.id}
                      selected={isItemSelected}
                    >
                      <TableCell align="left" padding="none">
                        <IconButton
                          id="star-icon"
                          sx={{
                            pr: 0,
                            py: 0,
                            pl: 1.8,
                            "&:hover": { bgcolor: "inherit" },
                          }}
                          onClick={(event) => handleStarClick(event, contact)}
                        >
                          <StarIcon
                            fontSize="medium"
                            sx={{
                              color: starIconColors[isFavorited(contact.id)],
                              "&:hover": { fill: grey[400] },
                            }}
                          />
                        </IconButton>
                      </TableCell>
                      <TableCell align="left" padding="normal">
                        {(currentHover === contact.id || isItemSelected) && (
                          <Checkbox
                            onClick={(event) =>
                              handleCheckboxClick(event, contact.id)
                            }
                            color="primary"
                            checked={isItemSelected}
                          />
                        )}
                        {currentHover !== contact.id &&
                          !isItemSelected &&
                          contact.image && (
                            <Avatar
                              alt={contact.fullName}
                              src={`${process.env.REACT_APP_BASE_URL}/${contact.image}`}
                              sx={{
                                m: 0.12,
                                width: 40,
                                height: 40,
                              }}
                            />
                          )}
                        {currentHover !== contact.id &&
                          !isItemSelected &&
                          !contact.image && (
                            <Avatar
                              alt={contact.fullName}
                              sx={{
                                m: 0.12,
                                fontSize: 12,
                                width: 40,
                                height: 40,
                              }}
                            >
                              {contact.firstName[0].toUpperCase() +
                                contact.lastName[0].toUpperCase()}
                            </Avatar>
                          )}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {contact.fullName}
                      </TableCell>
                      <TableCell align="left">
                        <a
                          className="hover:underline"
                          href={`tel:${contact.phoneMobile}`}
                          onClick={handlePhoneClick}
                        >
                          {contact.phoneMobile}
                        </a>
                      </TableCell>
                      <TableCell align="left">
                        <a
                          className="hover:underline"
                          href={`mailto:${contact.email}`}
                          onClick={handleEmailClick}
                        >
                          {contact.email}
                        </a>
                      </TableCell>
                      <TableCell align="left">
                        {contact.tags.map((tag) => {
                          return (
                            <span
                              key={`tag-${tag.title}`}
                              className="after:content-[',_'] last:after:content-none"
                            >
                              {tag.title}
                            </span>
                          );
                        })}
                      </TableCell>
                      <TableCell align="right">
                        {currentHover === contact.id && <MoreHorizIcon />}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={contacts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default ContactsTable;
