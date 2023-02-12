import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, createTheme, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "./axios-config";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

function SidebarFile({ fileName, path, setViewerPath }) {
  return (
    <Button
      variant="text"
      sx={{ width: "100%", textAlign: "left", display: "block" }}
      onClick={() => {
        setViewerPath(path);
      }}
    >
      <Typography>{fileName}</Typography>
    </Button>
  );
}

function SidebarTree({ fileTree, path, setViewerPath }) {
  return (
    <>
      {Object.entries(fileTree).map(([key, value]) => {
        if (value === null) {
          return (
            <SidebarFile
              fileName={key}
              path={path + "/" + key}
              setViewerPath={setViewerPath}
            />
          );
        } else {
          return (
            <Accordion key={path + "/" + key}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
              >
                <Typography>{key}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <SidebarTree
                  fileTree={value}
                  path={path + "/" + key}
                  setViewerPath={setViewerPath}
                />
              </AccordionDetails>
            </Accordion>
          );
        }
      })}
    </>
  );
}

function SidebarList({ setViewerPath }) {
  const [files, setFiles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const fileTypes = [".csv", ".json", ".log", ".ply", ".step", ".stl"];
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [runs, setRuns] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);
  useEffect(() => {
    axiosInstance.get("/fs/list").then((response) => setFiles(response.data));
    axiosInstance
      .get("/api/customer")
      .then((response) => setCustomers(response.data));
    axiosInstance.get("/api/job").then((response) => setJobs(response.data));
    axiosInstance.get("/api/run").then((response) => setRuns(response.data));
  }, []);
  const theme = createTheme({ palette: { mode: "dark" } });

  const filteredFiles = files.filter((file) => {
    if (
      selectedCustomer &&
      selectedCustomer !== file?.Job?.Contract?.customer_ID
    ) {
      return false;
    }
    if (selectedJob && selectedJob !== file.job_ID) {
      return false;
    }
    if (selectedRun && selectedRun !== file.run_ID) {
      if (file.Runs && file.Runs.some((run) => run.ID === selectedRun)) {
        return true;
      }
      return false;
    }
    return true;
  });
  const fileButtons = [];

  filteredFiles.forEach((file) => {
    const filteredKeys = Object.entries(file).filter(([key, value]) => {
      if (key.endsWith("file_name") && value) {
        if (selectedFileType) {
          return value.endsWith(selectedFileType);
        }
        return true;
      }
      return key.endsWith("file_name") && value;
    });

    filteredKeys.forEach(([_, value]) => {
      const customerName = file?.Job?.Contract?.Customer?.name;
      const jobName = file?.Job?.name;
      const container = file.container;
      const path =
        "/" + customerName + "/" + jobName + "/" + container + "/" + value;
      fileButtons.push(
        <>
          <div style={{ height: "20px" }}></div>
          <SidebarFile
            fileName={value}
            path={path}
            setViewerPath={setViewerPath}
          ></SidebarFile>
        </>
      );
    });
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          <div>
            <InputLabel>Customer</InputLabel>
            <Select
              id="customerSelect"
              label="Customer"
              defaultValue=""
              onChange={(event) => setSelectedCustomer(event.target.value)}
              sx={{ width: "150px" }}
            >
              {customers.map((customer) => (
                <MenuItem value={customer.ID}>{customer.name}</MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <InputLabel>File Type</InputLabel>
            <Select
              id="fileTypeSelect"
              label="File Type"
              defaultValue=""
              onChange={(event) => setSelectedFileType(event.target.value)}
              sx={{ width: "150px" }}
            >
              {fileTypes.map((type) => (
                <MenuItem value={type}>{type}</MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <InputLabel>Job</InputLabel>
            <Select
              id="jobSelect"
              label="Job"
              defaultValue=""
              onChange={(event) => setSelectedJob(event.target.value)}
              sx={{ width: "150px" }}
            >
              {jobs.map((job) => (
                <MenuItem value={job.ID}>{job.name}</MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <InputLabel>Run</InputLabel>
            <Select
              id="runSelect"
              label="Run"
              defaultValue=""
              onChange={(event) => setSelectedRun(event.target.value)}
              sx={{ width: "150px" }}
            >
              {runs.map((run) => (
                <MenuItem value={run.ID}>{run.influx_UUID}</MenuItem>
              ))}
            </Select>
          </div>
        </div>
      </ThemeProvider>
      {fileButtons}
    </>
  );
}

function Sidebar({ fileTree, setViewerPath }) {
  const [selectedPanel, setSelectedPanel] = useState("tree");
  return (
    <div className="Sidebar">
      <h2 className="Sidebar-header">Files</h2>
      <div className="Sidebar-selector">
        <Button
          variant="text"
          sx={{ flexGrow: 1 }}
          onClick={() => {
            setSelectedPanel("tree");
          }}
        >
          <Typography>Tree</Typography>
        </Button>
        <Button
          variant="text"
          sx={{ flexGrow: 1 }}
          onClick={() => {
            setSelectedPanel("list");
          }}
        >
          <Typography>List</Typography>
        </Button>
      </div>
      {selectedPanel === "tree" && (
        <SidebarTree
          fileTree={fileTree}
          path={""}
          setViewerPath={setViewerPath}
        />
      )}
      {selectedPanel === "list" && (
        <SidebarList setViewerPath={setViewerPath} />
      )}
    </div>
  );
}

export default Sidebar;
