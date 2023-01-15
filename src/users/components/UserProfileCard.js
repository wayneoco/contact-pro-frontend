import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";

import UserProfileHeader from "./UserProfileHeader";
import UserProfileDetails from "./UserProfileDetails";
import UserProfileContactsData from "./UserProfileContactsData";

const UserProfileCard = (props) => {
  const { user, userContactData } = props;

  return (
    <Box
      id="user-profile-card"
      sx={{ flexGrow: 1, m: "auto", maxWidth: "640px" }}
    >
      <Grid container direction="column" spacing={4}>
        <UserProfileHeader user={user} />
        <UserProfileDetails user={user} userContactData={userContactData} />
        {/* <UserProfileContactsData user={user} /> */}
      </Grid>
    </Box>
  );
};

export default UserProfileCard;
