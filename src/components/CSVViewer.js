import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Papa from "papaparse";
import CircularProgress from "@mui/material/CircularProgress";

function CSVViewer({ viewerData }) {
  const [csvData, setCSVData] = useState([]);
  const [csvColumns, setCSVColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (viewerData) {
      // This sanitization step is necessary to sanitize non-standard CSV metadata
      setIsLoading(true);
      const lines = viewerData.split("\n");
      let index = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(",")) {
          index = i;
          break;
        }
      }
      const sanitizedLines = lines.slice(index);
      const sanitizedData = sanitizedLines.join("\n");
      Papa.parse(sanitizedData, {
        header: true,
        dynamicTyping: true,
        complete: handleDataChange,
      });
    }
  }, [viewerData]);

  useEffect(() => {
    if (csvData.length && csvColumns.length) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [csvData, csvColumns]);

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

  if (!isLoading) {
    return (
      <div
        style={{
          height: "calc(100vh - 70px)",
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
