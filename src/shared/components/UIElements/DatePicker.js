import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DatePicker as MUIDatePicker } from "@mui/x-date-pickers-pro";
import {
  ThemeProvider,
  createTheme,
  experimental_sx as sx,
} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";

const theme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: sx({
          p: 0,
          width: 157,
          height: 24,
          "&.Mui-focused .MuiInputBase-input": {
            twRingShadow: "none",
          },
        }),
        input: sx({
          px: 2,
          py: 0,
          fontSize: 12,
          bgColor: "background.paper",
          height: 16,
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
        }),
        notchedOutline: sx({
          borderColor: grey[200],
          borderRadius: "5px",
        }),
      },
    },
  },
});

const DatePicker = (props) => {
  const clearInputHandler = (event) => {
    event.stopPropagation();
    props.setValue(null);
    props.onChange(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MUIDatePicker
          label="Select a Date"
          value={props.value}
          minDate={props.minDate}
          maxDate={props.maxDate}
          desktopModeMediaQuery="@media (pointer: none)"
          onChange={props.onChange}
          renderInput={({ inputRef, inputProps, InputProps }) => (
            <TextField
              ref={inputRef}
              InputProps={{
                ...inputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    {inputProps.value && (
                      <IconButton onClick={clearInputHandler}>
                        <CloseIcon sx={{ mr: 0, width: 12, height: 12 }} />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              className="p-1 border-1 rounded-md text-xs"
            />
            // {InputProps?.endAdornment}
          )}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default DatePicker;
