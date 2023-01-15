import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {
  ThemeProvider,
  createTheme,
  experimental_sx as sx,
} from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { blue, grey } from "@mui/material/colors";

const theme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        root: sx({
          p: 0,
        }),
        inputRoot: sx({
          p: 0,
          flexWrap: "nowrap",
        }),
        input: sx({
          pl: 2,
        }),
        inputFocused: sx({
          boxShadow: "none",
        }),
        hasPopupIcon: sx({
          p: 0,
        }),
        hasClearIcon: sx({
          p: 0,
        }),
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: sx({
          p: 0,
          width: 157,
          height: 24,
          "&.Mui-focused .MuiInputBase-input": {
            boxShadow: "none",
          },
        }),
        input: sx({
          pl: 2,
          fontSize: 12,
          bgColor: "background.paper",
          width: "100%",
          height: 16,
          "&:hover": {
            boxShadow: "none",
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: sx({
          p: 0,
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: grey[200],
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: grey[200],
          },
        }),
        input: sx({
          py: 0,
          pr: 0,
        }),
        notchedOutline: sx({
          borderColor: grey[200],
          borderRadius: "5px",
        }),
      },
    },
  },
});

const ContactFrequencySelect = (props) => {
  const {
    frequencies,
    value,
    inputValue,
    setInputValue,
    onChange,
    clearInputHandler,
  } = props;
  const categories = Object.keys(frequencies).map((frequency) => {
    return { title: frequency[0].toUpperCase() + frequency.slice(1) };
  });

  return (
    <ThemeProvider theme={theme}>
      <Autocomplete
        clearOnBlur={false}
        forcePopupIcon={false}
        value={value}
        inputValue={inputValue}
        ListboxProps={{ placement: "bottom", sx: { fontSize: 12 } }}
        sx={{
          display: "inline-block",
        }}
        id="contact-frequency-select"
        isOptionEqualToValue={(option, value) => {
          return option.title === value;
        }}
        options={categories}
        getOptionLabel={(option) => {
          return option.title || option;
        }}
        onChange={onChange}
        onInputChange={(_, v) => setInputValue(v)}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    {params.inputProps.value && (
                      <IconButton onClick={() => clearInputHandler(params)}>
                        <CloseIcon sx={{ mr: 0, width: 12, height: 12 }} />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          );
        }}
      />
    </ThemeProvider>
  );
};

export default ContactFrequencySelect;
