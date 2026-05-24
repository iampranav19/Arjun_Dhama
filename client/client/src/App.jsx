import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    clientName: "",
    domain: "",
    image: "",
  });

  const [deploymentId, setDeploymentId] = useState(null);

  const [deploymentStatus, setDeploymentStatus] =
    useState("");

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit deployment
  const handleDeploy = async () => {
  try {
    setLoading(true);

    const response = await axios.post(
      "http://localhost:5000/api/deploy",
      formData
    );

    setDeploymentId(response.data.deploymentId);

    setDeploymentStatus(response.data.status);

    // Clear form after deployment
    setFormData({
      clientName: "",
      domain: "",
      image: "",
    });

    setLoading(false);

  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};

  // Poll deployment status
  useEffect(() => {

    if (!deploymentId) return;

    const interval = setInterval(async () => {
      try {

        const response = await axios.get(
          `http://localhost:5000/api/status/${deploymentId}`
        );

        setDeploymentStatus(response.data.status);

      } catch (error) {
        console.error(error);
      }
    }, 3000);

    return () => clearInterval(interval);

  }, [deploymentId]);

  return (
    <div className="container">

      <h1>🚀 Deployment Control Panel</h1>

      <div className="form">

        <input
          type="text"
          name="clientName"
          placeholder="Client Name"
          value={formData.clientName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="domain"
          placeholder="Domain"
          value={formData.domain}
          onChange={handleChange}
        />

        <input
          type="text"
          name="image"
          placeholder="Docker Image"
          value={formData.image}
          onChange={handleChange}
        />

        <button onClick={handleDeploy}>
          {loading ? "Deploying..." : "Deploy"}
        </button>

      </div>

      {deploymentId && (
        <div className="status-card">

          <h2>🚀 Deployment Status</h2>

          <div className="info-box">

            <div className="label">
              Deployment ID
            </div>

            <div className="value">
              {deploymentId}
            </div>

          </div>

          <div className="status-wrapper">

            <div className="status-text">
              Current Status
            </div>

            <div
              className={`status ${deploymentStatus.toLowerCase()}`}
            >
              {deploymentStatus}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;