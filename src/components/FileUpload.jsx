
import React from "react";
import { Buffer } from "buffer";
import "./FileUpload.css";

function FileUpload({ setFile }) {
  async function handleFileUpload(event) {
    const fileUpload = await event.target.files[0].arrayBuffer();
    const file = {
      type: event.target.files[0].type,
      file: Buffer.from(fileUpload).toString("base64"),
      imageUrl: event.target.files[0].type.includes("pdf")
        ? "./document-icon.png"
        : URL.createObjectURL(event.target.files[0]),
    };
    setFile(file);
  }

  return (
    <section className="file-upload-section">
      <h2 className="file-upload-title">Get Started</h2>
      <label className="file-upload-button">
        Choose File
        <input
          type="file"
          accept=".pdf, .jpg, .jpeg, .png"
          onChange={handleFileUpload}
          className="file-input"
        />
      </label>
    </section>
  );
}

export default FileUpload;
