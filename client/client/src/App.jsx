import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [formData, setFormData] = useState({
    clientName: "",
    domain: "",
    image: "",
  });

  const [deployments, setDeployments] = useState([]);

  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Fetch Deployments
  const fetchDeployments = async () => {
    try {

      const response = await axios.get(
        "http://localhost:5000/api/deployments"
      );

      setDeployments(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  // Submit Deployment
  const handleDeploy = async () => {
    try {

      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/deploy",
        formData
      );

      // Clear Form
      setFormData({
        clientName: "",
        domain: "",
        image: "",
      });

      // Refresh Deployments
      fetchDeployments();

      setLoading(false);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Polling
  useEffect(() => {

    fetchDeployments();

    const interval = setInterval(() => {
      fetchDeployments();
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="container">

      <h1>🚀 Deployment Control Panel</h1>

      {/* FORM */}
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

      {/* DASHBOARD */}
      <div className="dashboard">

        <h2>Deployment History</h2>

        <div className="table">

          <div className="table-header">
            <div>Client</div>
            <div>Domain</div>
            <div>Image</div>
            <div>Status</div>
          </div>

          {deployments.map((deployment) => (

            <div
              className="table-row"
              key={deployment._id}
            >

              <div>{deployment.clientName}</div>

              <div>{deployment.domain}</div>

              <div>{deployment.image}</div>

              <div>
                <span
                  className={`status ${deployment.status.toLowerCase()}`}
                >
                  {deployment.status}
                </span>
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default App;