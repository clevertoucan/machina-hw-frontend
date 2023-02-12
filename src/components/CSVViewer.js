import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Papa from "papaparse";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * This is the main CSV file viewer component
 * @param viewerData a blob with the CSV data
 * @returns a MUI datagrid with the CSV data
 */
function CSVViewer({ viewerData }) {
  // stores the parsed CSV data
  const [csvData, setCSVData] = useState([]);
  // stores the parsed CSV columns
  const [csvColumns, setCSVColumns] = useState([]);
  // keeps track of wehether or not the file is ready to be displayed
  const [isLoading, setIsLoading] = useState(true);

  // Whenever we get new CSV data, we parse it and sanitize it before feeding it into the DataGrid
  useEffect(() => {
    if (viewerData) {
      setIsLoading(true);
      viewerData.text().then((data) => {
        const lines = data.split("\n");
        let index = 0;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(",")) {
            index = i;
            break;
          }
        }
        // This sanitization step is necessary to sanitize non-standard CSV metadata at the top of the files
        const sanitizedLines = lines.slice(index);
        const sanitizedData = sanitizedLines.join("\n");
        // Parses the CSV data and passes it to handleDataChange to format it for the DataGrid
        Papa.parse(sanitizedData, {
          header: true,
          dynamicTyping: true,
          complete: handleDataChange,
        });
      });
    }
  }, [viewerData]);

  // This formats the parsed CSV data for the DataGrid
  const handleDataChange = (file) => {
    const rows = file.data.map((row, index) => ({
      id: "csvRow" + String(index),
      ...row,
    }));
    setCSVData(rows);
    const columns = file.meta.fields.map((column) => {
      return { field: column, headerName: column, width: 90 };
    });
    setCSVColumns(columns);
  };

  // if we have valid csvData and csvColumns, we're ready to display the DataGrid
  useEffect(() => {
    if (csvData.length && csvColumns.length) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [csvData, csvColumns]);

  if (!isLoading) {
    return (
      <div
        style={{
          height: "calc(100vh - 90px)",
          marginRight: "30px",
          marginLeft: "20px",
        }}
      >
        <DataGrid
          rows={csvData}
          columns={csvColumns}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    );
  } else {
    return (
      <>
        <div style={{ marginTop: "100px" }}></div>
        <CircularProgress />
      </>
    );
  }
}

export default CSVViewer;
