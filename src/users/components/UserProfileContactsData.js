import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import Typography from "@mui/material/Typography";
import grey from "@mui/material/colors/grey";

import Item from "../../shared/components/layout/Item";

const userProfileFields = [
  { key: "firstName", title: "First name" },
  { key: "lastName", title: "Last name" },
  { key: "email", title: "email" },
];

const UserProfileContactsData = (props) => {
  const user = props.user;

  return (
    <Grid container sx={{ flexGrow: 1 }} spacing={4}>
      <Grid sx={{ width: "100%" }}>
        <Item sx={{ mt: 0, p: 0 }}>
          <Box sx={{ mb: 2, p: "0.5", bgcolor: grey[50] }}>
            <Grid>
              <Typography variant="subtitle1" component="h3">
                Your user profile
              </Typography>
            </Grid>
          </Box>
          <Box sx={{ p: 1 }}>
            {userProfileFields.map((field) => {
              return (
                <Grid container sx={{ pt: 0, py: 0, pb: 0, pl: 1.75 }}>
                  <Grid
                    xs={4}
                    sx={{ textAlign: "right" }}
                  >{`${field.title}: `}</Grid>
                  <Grid
                    sx={{
                      pl: 2,
                      justifyContent: "flex-start",
                      color: grey[800],
                    }}
                  >
                    {user[field.key]}
                  </Grid>
                </Grid>
              );
            })}
          </Box>
        </Item>
      </Grid>
    </Grid>
  );
};

export default UserProfileContactsData;
