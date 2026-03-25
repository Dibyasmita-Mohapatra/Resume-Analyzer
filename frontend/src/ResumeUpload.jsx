import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import jsPDF from "jspdf";

function ResumeUpload({ onUpload }) {
  const [files, setFiles] = useState([]); // now we accept multiple files
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [] }, // only PDFs
    multiple: true, // can select more than one file
    onDrop: (acceptedFiles) => setFiles(acceptedFiles), // store selected files in "files" state
  });

  const handleAnalyze = async () => {
    if (files.length === 0) {
      setToast({ message: "Please select at least one resume!", type: "error" });
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("file", file)); // append all files

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8081/api/analyze",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Backend should return an array of results
      setResults(res.data ? res.data : []);
      setToast({ message: "Resumes analyzed successfully!", type: "success" });

      if (onUpload) onUpload(); // refresh dashboard
    } catch (err) {
      console.error("Backend error:", err);
      setToast({ message: "Error analyzing resumes!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

const downloadReport = (result) => {

  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Resume Analysis Report", 20, 20);

  doc.setFontSize(12);
  doc.text(`Resume Name: ${result.resumeName}`, 20, 40);
  doc.text(`Score: ${result.score}`, 20, 50);

  doc.text(`Skills: ${result.skills.join(", ")}`, 20, 60);

  if (result.suggestions && result.suggestions.length > 0) {
    doc.text("Suggestions:", 20, 80);

    result.suggestions.forEach((s, i) => {
      doc.text(`- ${s}`, 25, 90 + i * 10);
    });
  }

  doc.save("resume-report.pdf");
};

  // Auto-hide toast after 3s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Resumes</h2>

      {/* File input */}
      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded-lg text-center mb-4 ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag & drop PDF resumes here, or click to select files</p>
        )}
      </div>

      {/* Analyze button */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className={`w-full p-2 rounded font-semibold text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Analyzing...
          </span>
        ) : (
          "Analyze Resumes"
        )}
      </button>

      {/* Toast notification */}
      {toast && (
        <div
          className={`mt-4 p-2 rounded text-center ${
            toast.type === "success"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Analysis results */}
      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold text-lg mb-2 text-center">Analysis Results</h3>
          {results.map((result, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-100 rounded">
              <p>
                <span className="font-semibold">Resume:</span> {result.resumeName}
              </p>
              <p>
                <span className="font-semibold">Score:</span> {result.score}
              </p>
              <p>
                <span className="font-semibold">Skills:</span> {result.skills.join(", ")}
                <button
                  onClick={() => downloadReport(result)}
                  className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Download Report
                </button>
              </p>
              {result.suggestions && result.suggestions.length > 0 && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">

                  <p className="font-semibold text-yellow-800 mb-1">
                    🤖 AI Suggestions
                  </p>

                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {result.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>

                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;