import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    if (!file) return;

    console.log("uploadFile to", url);

    try {
      // Get authorization token from localStorage
      const authorization_token = localStorage.getItem("authorization_token");

      if (!authorization_token) {
        alert("Authorization token is missing. Please refresh the page.");
        return;
      }

      // Get the presigned URL with Authorization header
      const response = await fetch(
        `${url}?name=${encodeURIComponent(file.name)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${authorization_token}`,
          },
        }
      );

      // Handle authorization errors
      if (response.status === 401) {
        alert(
          "Authorization token is missing or invalid. Please refresh the page."
        );
        return;
      }

      if (response.status === 403) {
        alert("Invalid credentials. Access denied.");
        return;
      }

      if (!response.ok) {
        alert(`Failed to get upload URL: ${response.statusText}`);
        return;
      }

      const presignedUrl = await response.text();
      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", presignedUrl);

      // Upload file to S3 using presigned URL
      const uploadResult = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
      });

      if (!uploadResult.ok) {
        alert(`Failed to upload file: ${uploadResult.statusText}`);
        return;
      }

      console.log("Upload successful!");
      alert("File uploaded successfully!");
      setFile(undefined);
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
