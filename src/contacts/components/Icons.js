import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import HistoryIcon from "@mui/icons-material/History";

import grey from "@mui/material/colors/grey";

const Icons = {
  email: <EmailOutlinedIcon fontSize="small" sx={{ color: grey[400] }} />,
  phoneMobile: (
    <PhoneIphoneOutlinedIcon fontSize="small" sx={{ color: grey[400] }} />
  ),
  website: <LinkOutlinedIcon fontSize="small" sx={{ color: grey[400] }} />,
  notes: <NotesOutlinedIcon fontSize="small" sx={{ color: grey[400] }} />,
  tags: <LabelOutlinedIcon fontSize="small" sx={{ color: grey[400] }} />,
  contactFrequency: <HistoryIcon fontSize="small" sx={{ color: grey[400] }} />,
};

export default Icons;
