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

  // SEARCH + FILTER
  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

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

  // FILTER LOGIC
  const filteredDeployments = deployments.filter(
    (deployment) => {

      const matchesSearch =
        deployment.clientName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        deployment.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  // METRICS
  const totalDeployments = deployments.length;

  const runningDeployments = deployments.filter(
    (d) => d.status === "Running"
  ).length;

  const completedDeployments = deployments.filter(
    (d) => d.status === "Completed"
  ).length;

  const failedDeployments = deployments.filter(
    (d) => d.status === "Failed"
  ).length;

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

      {/* METRICS */}
      <div className="metrics">

        <div className="metric-card">
          <h3>Total Deployments</h3>
          <p>{totalDeployments}</p>
        </div>

        <div className="metric-card running-card">
          <h3>Running</h3>
          <p>{runningDeployments}</p>
        </div>

        <div className="metric-card completed-card">
          <h3>Completed</h3>
          <p>{completedDeployments}</p>
        </div>

        <div className="metric-card failed-card">
          <h3>Failed</h3>
          <p>{failedDeployments}</p>
        </div>

      </div>

      {/* DASHBOARD */}
      <div className="dashboard">

        <h2>Deployment History</h2>

        {/* SEARCH + FILTER */}
        <div className="controls">

          <input
            type="text"
            placeholder="Search by client..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Running">Running</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>

        </div>

        {/* TABLE */}
        <div className="table">

          <div className="table-header">
            <div>Client</div>
            <div>Domain</div>
            <div>Image</div>
            <div>Status</div>
          </div>

          {filteredDeployments.map((deployment) => (

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