import { LazyLog } from "react-lazylog";

const baseUrl = "http://localhost:3001/fs/path";

function LogViewer({ viewerPath }) {
  return (
    <div
      style={{
        height: "calc(100vh - 90px)",
        marginRight: "30px",
        marginLeft: "20px",
      }}
    >
      <LazyLog url={baseUrl + viewerPath} />
    </div>
  );
}

export default LogViewer;
