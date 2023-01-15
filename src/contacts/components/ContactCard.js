import { Link } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";

import ContactHeader from "./ContactHeader";
import ContactDetails from "./ContactDetails";
import ContactRelationship from "./ContactRelationship";

const ContactCard = (props) => {
  const contact = props.contact;

  return (
    <Box sx={{ flexGrid: 1, m: "auto", maxWidth: "640px" }}>
      <Grid container direction="column" spacing={3}>
        <ContactHeader contact={contact} />
        <ContactDetails contact={contact} />
        <ContactRelationship contact={contact} />
        <Grid>
          <div className="text-sm font-light text-gray-500">
            <Link to="/contacts">
              <ArrowBackOutlinedIcon sx={{ fontSize: "md" }} /> back
            </Link>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactCard;
