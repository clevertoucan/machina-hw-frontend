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

/**
 * This component represents an individual file in the sidebar
 * @param fileName the name of the file
 * @param path the url path to the file
 * @param setViewerPath a reference to set the path for the FileViewer
 * @returns a button that will set the file path for the file viewer when clicked
 */
function SidebarFile({ fileName, path, setViewerPath }) {
  return (
    <Button
      variant="text"
      sx={{ width: "100%", textAlign: "left", display: "block" }}
      onClick={() => {
        setViewerPath({ path, filename: fileName });
      }}
    >
      <Typography>{fileName}</Typography>
    </Button>
  );
}

/**
 * This function recursively generates a document tree from metadata that the backend provides
 * @param fileTree an object representing the file structure of the files on the backend
 * @param path keeps track of the current path in the document tree
 * @param setViewerPath a reference to set the path for the FileViewer
 * @returns a tree-based document explorer
 */
function SidebarTree({ fileTree, path, setViewerPath }) {
  return (
    <>
      {Object.entries(fileTree).map(([key, value]) => {
        // if the value is null, we're dealing with a file, not a directory
        if (value === null) {
          return (
            <SidebarFile
              key={path + "/" + key + "FileButton"}
              fileName={key}
              path={path + "/" + key}
              setViewerPath={setViewerPath}
            />
          );
        } else {
          // We're dealing with a directory, so we create a new Accordion level
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

/**
 * This function generates a filterable list-based document explorer from the files
 * on the backend
 * @param setViewerPath a reference to set the path for the FileViewer
 * @returns a list-based document explorer
 */
function SidebarList({ setViewerPath }) {
  // stores all of the file entries
  const [files, setFiles] = useState([]);

  // stores all of the customers from the backend
  const [customers, setCustomers] = useState([]);
  // if the user selects a customer to filter on, it'll be stored here
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // stores all of the possible file types
  const fileTypes = [".csv", ".json", ".log", ".ply", ".step", ".stl"];
  // if the user selects a file type to filter on, it'll be stored here
  const [selectedFileType, setSelectedFileType] = useState(null);

  // stores all of the jobs from the backend
  const [jobs, setJobs] = useState([]);
  // if the user selects a job to filter on, it'll be stored here
  const [selectedJob, setSelectedJob] = useState(null);

  // stores all of the runs from the backend
  const [runs, setRuns] = useState([]);
  // if the user selects a run to filter on, it'll be stored here
  const [selectedRun, setSelectedRun] = useState(null);

  // retrieves all of the files, customers, jobs, and runs from the backend
  useEffect(() => {
    axiosInstance.get("/fs/list").then((response) => setFiles(response.data));
    axiosInstance
      .get("/api/customer")
      .then((response) => setCustomers(response.data));
    axiosInstance.get("/api/job").then((response) => setJobs(response.data));
    axiosInstance.get("/api/run").then((response) => setRuns(response.data));
  }, []);

  const theme = createTheme({ palette: { mode: "dark" } });

  // this will filter the files based on the selected parameters
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
    // selects any buildfiles or scans that were associated with the selected run
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
    // filters the files on the selected file type
    const filteredKeys = Object.entries(file).filter(([key, value]) => {
      if (key.endsWith("file_name") && value) {
        if (selectedFileType) {
          return value.endsWith(selectedFileType);
        }
        return true;
      }
      return key.endsWith("file_name") && value;
    });

    // builds the file path from the file's relations and creates the file buttons
    filteredKeys.forEach(([_, value]) => {
      const customerName = file?.Job?.Contract?.Customer?.name;
      const jobName = file?.Job?.name;
      const container = file.container;
      const path =
        "/" + customerName + "/" + jobName + "/" + container + "/" + value;
      fileButtons.push(
        <div key={path + "FileButton"}>
          <div style={{ height: "20px" }}></div>
          <SidebarFile
            fileName={value}
            path={path}
            setViewerPath={setViewerPath}
          ></SidebarFile>
        </div>
      );
    });
  });

  return (
    <>
      {/* Creates the Select inputs for the user to filter the files*/}
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
                <MenuItem key={customer.ID + "Customer"} value={customer.ID}>
                  {customer.name}
                </MenuItem>
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
                <MenuItem key={type + "FileType"} value={type}>
                  {type}
                </MenuItem>
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
                <MenuItem key={job.ID + "Job"} value={job.ID}>
                  {job.name}
                </MenuItem>
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
                <MenuItem key={run.ID + "Run"} value={run.ID}>
                  {run.influx_UUID}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
      </ThemeProvider>
      {fileButtons}
    </>
  );
}

/**
 * This is the main Sidebar component, it either displays the SidebarList or SidebarTree
 * component based on the user's selected panel
 * @param fileTree an object representing the file structure of the files on the backend
 * @param setViewerPath a reference to set the path for the FileViewer
 * @returns the sidebar for the webapp
 */
function Sidebar({ fileTree, setViewerPath }) {
  // This stores the currently selected sidebar panel, will either be "tree" or "list"
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
