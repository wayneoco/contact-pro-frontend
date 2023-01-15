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
import Icons from "./Icons";

const contactFields = ["phoneMobile", "email", "website", "notes"];

const ContactDetails = (props) => {
  const contact = props.contact;
  const contactItemKeys = Object.keys(contact).filter((itemKey) => {
    return contactFields.includes(itemKey);
  });

  return (
    <Grid container sx={{ flexGrow: 1 }} spacing={4}>
      <Grid sx={{ width: "100%" }}>
        <Item sx={{ mt: 0, p: 0 }}>
          <Box sx={{ mb: 2, p: "0.5", bgcolor: grey[50] }}>
            <Grid>
              <Typography variant="subtitle1" component="h3">
                Contact Details
              </Typography>
            </Grid>
          </Box>
          <Box sx={{ p: 1 }}>
            {contactItemKeys.map((itemKey) => {
              if (contact[itemKey]) {
                return (
                  <Grid container sx={{ pt: 0, py: 0, pb: 0, pl: 1.75 }}>
                    <Grid xs={1}>{Icons[itemKey]}</Grid>
                    <Grid
                      sx={{
                        pl: 2,
                        justifyContent: "flex-start",
                        color: grey[800],
                      }}
                    >
                      {contact[itemKey]}
                    </Grid>
                  </Grid>
                );
              }
            })}
            <Grid container sx={{ pt: 0, py: 0, pb: 0, pl: 1.75 }}>
              <Grid xs={1}>
                <LabelOutlinedIcon fontSize="small" sx={{ color: grey[400] }} />
              </Grid>
              <Grid
                sx={{
                  pl: 2,
                  justifyContent: "flex-start",
                  color: grey[800],
                }}
              >
                {contact.tags.map((tag) => {
                  return (
                    <span className="after:content-[',_'] last:after:content-none">
                      {tag.title}
                    </span>
                  );
                })}
              </Grid>
            </Grid>

            <Grid>
              <div className="flex gap-2.5 justify-end text-xs italic text-slate-400">
                <div>{`created: ${new Date(
                  contact.dateCreated
                ).toLocaleDateString()}`}</div>
                <div>{`updated: ${new Date(
                  contact.dateModified
                ).toLocaleDateString()}`}</div>
              </div>
            </Grid>
          </Box>
        </Item>
      </Grid>
    </Grid>
  );
};

export default ContactDetails;
