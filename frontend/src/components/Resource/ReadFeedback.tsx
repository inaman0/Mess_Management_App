import React, { useState, useEffect } from "react";
import apiConfig from "../../config/apiConfig";
import "./ReadFeedback.css"; // Assuming you have a CSS file for styling
export type ResourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const ReadFeedback = () => {
  const [feedbackData, setFeedbackData] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const itemsPerPage = 5;
  const regex = /^(g_|archived|extra_data)/;

  const apiUrl = `${apiConfig.getResourceUrl("feedback")}?`;
  const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Feedback")}?`;

  // Fetch data
  useEffect(() => {
    const fetchResourceData = async () => {
      const params = new URLSearchParams();
      const ssid: any = sessionStorage.getItem("key");
      const queryId = "GET_ALL";
      params.append("queryId", queryId);
      params.append("session_id", ssid);

      try {
        const response = await fetch(apiUrl + params.toString(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Error:" + response.status);
        const data = await response.json();
        setFeedbackData(data.resource || []);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };

    fetchResourceData();
  }, []);

  // Fetch metadata
  useEffect(() => {
    const fetchResMetaData = async () => {
      try {
        const response = await fetch(metadataUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Error:" + response.status);
        const metaData = await response.json();
        setResMetaData(metaData);
        setFields(metaData[0]?.fieldValues || []);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };

    fetchResMetaData();
  }, []);

  const displayFields = fields.filter(
    (field) => !regex.test(field.name) && field.name !== "id"
  );

  // Pagination logic
  const totalPages = Math.ceil(feedbackData.length / itemsPerPage);
  const paginatedData = feedbackData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <h2>Student Feedback</h2>
      </div>

      {paginatedData.length === 0 ? (
        <div className="alert">No feedback data available.</div>
      ) : (
        <div className="feedback-grid">
          {paginatedData.map((feedback, index) => (
            <div key={index} className="feedback-card">
              {displayFields.map((field) => (
                <div key={field.name} className="feedback-item">
                  <strong>{field.name}:</strong>{" "}
                  {field.name === "Image" && feedback[field.name] ? (
                    <img
                      src={feedback[field.name].replace(/\s/g, "+")}
                      alt="Feedback"
                      className="feedback-image"
                      onClick={() =>
                        setSelectedImage(
                          feedback[field.name].replace(/\s/g, "+")
                        )
                      }
                    />
                  ) : field.name.toLowerCase() === "description" ||
                    field.name.toLowerCase() === "feedback" ? (
                    <div className="feedback-text-scroll">
                      <span>{feedback[field.name] || "N/A"}</span>
                    </div>
                  ) : // Add date formatting for date fields
                  field.name.toLowerCase().includes("date") ? (
                    <span>
                      {feedback[field.name]
                        ? new Date(feedback[field.name]).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </span>
                  ) : (
                    <span>{feedback[field.name] || "N/A"}</span>
                  )}
                </div>
              ))}
              {/* <div className="whatsapp-share">
                <img
                  src="/Whatsapp.png"
                  alt="Share on WhatsApp"
                  className="whatsapp-icon"
                  onClick={() => shareOnWhatsApp(feedback)}
                  title="Share on WhatsApp"
                />
              </div> */}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span className="page-count">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next
        </button>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content">
            <img src={selectedImage} alt="Full Feedback" />
            <button
              className="modal-close"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadFeedback;
