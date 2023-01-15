import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import grey from "@mui/material/colors/grey";

import Item from "../../shared/components/layout/Item";
// import Icons from "./Icons";

const userProfileFields = [
  { key: "firstName", title: "First name" },
  { key: "lastName", title: "Last name" },
  { key: "email", title: "Email" },
  { key: "numberOfContacts", title: "Contacts" },
  { key: "numberOfFavorites", title: "Favorites" },
  { key: "numberOfTracked", title: "Tracked" },
];

const UserProfileDetails = (props) => {
  const { user, userContactData } = props;

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
            {userProfileFields.map(({ title, key }) => {
              return (
                <Grid container sx={{ pt: 0, py: 0, pb: 0, pl: 1.75 }}>
                  <Grid xs={4} sx={{ textAlign: "right" }}>
                    {`${title}: `}
                  </Grid>
                  <Grid
                    sx={{
                      pl: 2,
                      justifyContent: "flex-start",
                      color: grey[800],
                    }}
                  >
                    {user[key] ? user[key] : userContactData[key]}
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

export default UserProfileDetails;
