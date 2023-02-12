import ReactJSON from "react-json-view";

function JSONViewer({ viewerData }) {
  return (
    <div
      style={{
        marginRight: "20px",
        marginLeft: "20px",
        height: "calc(100vh - 90px)",
        overflowY: "scroll",
        fontSize: "16px",
      }}
    >
      <ReactJSON src={viewerData} collapsed={1} displayDataTypes={false} />
    </div>
  );
}

export default JSONViewer;
