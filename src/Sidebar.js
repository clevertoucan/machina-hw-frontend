import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button } from "@mui/material";

function SidebarFile({ fileName, path }) {
  return (
    <Button variant="text" sx={{ width: "100%", textAlign: "left" }}>
      <Typography>{fileName}</Typography>
    </Button>
  );
}

function SidebarHelper({ fileTree, path }) {
  console.log(JSON.stringify(fileTree));
  return (
    <>
      {Object.entries(fileTree).map(([key, value]) => {
        if (value === null) {
          return <SidebarFile fileName={key} path={path + "/" + key} />;
        } else {
          return (
            <Accordion key={path + "/" + key}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
              >
                <Typography>{key}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <SidebarHelper fileTree={value} path={path + "/" + key} />
              </AccordionDetails>
            </Accordion>
          );
        }
      })}
    </>
  );
}

function Sidebar({ fileTree }) {
  return (
    <div className="Sidebar">
      <Typography>
        <h2 className="Sidebar-header">Files</h2>
      </Typography>
      <SidebarHelper fileTree={fileTree} path={""} />
    </div>
  );
}

export default Sidebar;
