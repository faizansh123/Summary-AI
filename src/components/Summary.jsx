import { useState, useEffect } from "react";
import Loader from "./Loader";
import "./Summary.css";

function Summary({ file }) {
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState("idle");

  async function getSummary() {
    setStatus("loading");

    try {
      const response = await fetch("http://localhost:5000/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileType: file.type,
          fileData: file.file,
        }),
      });

      const data = await response.json();
      setSummary(data.summary);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  useEffect(() => {
    if (status === "idle") {
      getSummary();
    }
  }, [status]);

  return (
    <section className="summary-section">
      <div className="summary-image-container">
        <img
    src={
      file.type.includes("pdf")
      ? "./document-icon.png"
      : file.imageUrl
  }
   alt="Preview"
  className={`summary-image ${file.type.includes("pdf") ? "pdf-icon" : ""}`}
/>
      </div>
      <h2 className="summary-title">Summary</h2>
      {status === "loading" ? (
        <Loader />
      ) : status === "success" ? (
        <p className="summary-text">{summary}</p>
      ) : status === "error" ? (
        <p className="summary-text error">Error getting summary</p>
      ) : null}
    </section>
  );
}

export default Summary;
