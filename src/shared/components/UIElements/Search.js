import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useAutocomplete } from "@mui/base/AutocompleteUnstyled";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { autocompleteClasses } from "@mui/material/Autocomplete";

import { UserContext } from "../../contexts/user-context";
import { useHttpClient } from "../../hooks/http-hook";

const Root = styled("div")(
  ({ theme }) => `
  color: ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,.85)"
  };
  font-size: 14px;
`
);

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled("div")(
  ({ theme }) => `
  width: 100%;
  max-width: 600px;
  border: 1px solid ${theme.palette.mode === "dark" ? "#434343" : "#d9d9d9"};
  background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
  }

  &.focused {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
    color: ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.65)"
        : "rgba(0,0,0,.85)"
    };
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`
);

const Listbox = styled("ul")(
  ({ theme }) => `
  left: 0;
  right: 0;
  margin: 2px 32px 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === "dark" ? "#2b2b2b" : "#fafafa"};
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color: ${theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff"};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`
);

const Search = (props) => {
  const [contacts, setContacts] = useState([]);
  const { loggedInUser } = useContext(UserContext);
  const { sendRequest } = useHttpClient();

  useEffect(() => {
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

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
    value,
    setAnchorEl,
  } = useAutocomplete({
    id: "search",
    autoComplete: true,
    options: contacts,
    getOptionLabel: (option) => option.fullName,
    inputValue: inputValue,
    onInputChange: (_, value) => {
      setInputValue(value);

      if (!value) {
        setOpen(false);
      }
    },
    open: open,
    onOpen: () => {
      if (inputValue) {
        setOpen(true);
      }
    },
    onClose: () => setOpen(false),
  });

  return (
    <Root>
      <div {...getRootProps()}>
        <Label {...getInputLabelProps()}>Search</Label>
        <InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
          <input {...getInputProps()} />
        </InputWrapper>
      </div>
      {groupedOptions.length > 0 && (
        <Listbox {...getListboxProps()}>
          {groupedOptions.map((option, index) => (
            <Link to={`/contacts/${option.id}`} onClick={props.closeModal}>
              <li {...getOptionProps({ option, index })}>
                <span>{option.fullName}</span>
                <CheckIcon fontSize="small" />
              </li>
            </Link>
          ))}
        </Listbox>
      )}
      {groupedOptions.length === 0 && inputValue && (
        <Listbox {...getListboxProps()}>
          <li>
            <span>No matches found</span>
          </li>
        </Listbox>
      )}
    </Root>
  );
};

export default Search;
