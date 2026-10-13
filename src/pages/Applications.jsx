import "./Applications.css";
import { useEffect, useState } from "react";
import ApplicationDrawer from "../components/ApplicationDrawer";
import {
  approveApplication,
  getApplications,
  rejectApplication,
} from "../api/admin";

export default function Applications() {
  const [selectedGym, setSelectedGym] = useState(null);
  const [gyms, setGyms] = useState([]);
  const [processingAction, setProcessingAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getApplications();

      setGyms(Array.isArray(data.applications) ? data.applications : []);
    } catch (err) {
      console.error("Failed to load applications:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load applications.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <div className="applications">

      <div className="applications-header">
        <h2>Partner Applications</h2>

        <input
          placeholder="Search gym..."
          className="search"
        />
      </div>

      <div className="filters">

        <select>
          <option>All Status</option>
        </select>

        <select>
          <option>All Cities</option>
        </select>

        <select>
          <option>Newest</option>
        </select>

      </div>

      {error && (
        <div className="application-error">
          {error}
        </div>
      )}

      {loading && (
        <div className="application-empty">
          Loading applications...
        </div>
      )}

      {!loading && !error && gyms.length === 0 && (
        <div className="application-empty">
          No applications found.
        </div>
      )}

      {/* <table>

        <thead>
          <tr>
            <th>Gym</th>
            <th>Owner</th>
            <th>City</th>
            <th>Plans</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
<tbody>
  {gyms.map((gym) => (
    <tr
      key={gym._id}
      onClick={() => setSelectedGym(gym)}
      style={{ cursor: "pointer" }}
    >
      <td>{gym.gymName}</td>

      <td>{gym.partnerId}</td>

      <td>{gym.address}</td>

      <td>{Object.keys(gym.passes).length}</td>

      <td>
        <span className={`badge ${gym.status.toLowerCase()}`}>
          {gym.status}
        </span>
      </td>

      <td>{new Date(gym.createdAt).toLocaleDateString()}</td>
    </tr>
  ))}
</tbody>

        </tbody>

      </table> */}
{!loading && gyms.length > 0 && (
<div className="cards">
  {gyms.map((gym) => (
    <div
      key={gym._id}
      className="application-card"
      onClick={() => setSelectedGym(gym)}
    >
      <div className="top">
        <div>
          <div className="gym-name">{gym.gymName}</div>

          <div className="owner-name">
            {gym.ownerName}
          </div>
        </div>

        <span className={`badge ${gym.status}`}>
          {gym.status.toUpperCase()}
        </span>
      </div>

      <div className="address">
        📍 {gym.address}
      </div>

      <div className="info-grid">

        <div className="info-box">
          <label>Owner</label>
          <p>{gym.ownerName}</p>
        </div>

        <div className="info-box">
          <label>Email</label>
          <p>{gym.email}</p>
        </div>

        <div className="info-box">
          <label>Phone</label>
          <p>{gym.phone}</p>
        </div>

        <div className="info-box">
          <label>Rating</label>
          <p>⭐ {gym.rating}</p>
        </div>

        <div className="info-box">
          <label>Status</label>
          <p>{gym.status}</p>
        </div>

        <div className="info-box">
          <label>Created</label>
          <p>
            {new Date(gym.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="info-box full">
          <label>Google Place ID</label>
          <p>{gym.placeId}</p>
        </div>

        <div className="info-box full">
          <label>Request ID</label>
          <p>{gym._id}</p>
        </div>

      </div>

      <div className="price-grid">

        <div className="price-card">
          <h4>Daily</h4>
          <p>₹{gym.passes?.daily ?? "-"}</p>
        </div>

        <div className="price-card">
          <h4>Weekly</h4>
          <p>₹{gym.passes?.weekly ?? "-"}</p>
        </div>

        <div className="price-card">
          <h4>Monthly</h4>
          <p>₹{gym.passes?.monthly ?? "-"}</p>
        </div>

        <div className="price-card">
          <h4>Yearly</h4>
          <p>₹{gym.passes?.yearly ?? "-"}</p>
        </div>

      </div>
    </div>
  ))}
</div>
)}
{/* <ApplicationDrawer
    gym={selectedGym}
    onClose={() => setSelectedGym(null)}
/> */}

{/* <ApplicationDrawer
  gym={selectedGym}
  onClose={() => setSelectedGym(null)}
  onApprove={async (id) => {
    const ok = window.confirm("Approve this gym?");
    if (!ok) return;
    try {
      await approveApplication(id);
      await loadApplications();
      setSelectedGym(null);
    } catch (err) {
      console.log(err);
      alert("Failed to approve application");
    }
  }}
  onReject={async (id) => {
    const ok = window.confirm("Reject this application?");
    if (!ok) return;

    try {
      await rejectApplication(id);
      await loadApplications();
      setSelectedGym(null);
    } catch (err) {
      console.log(err);
      alert("Failed to reject application");
    }
  }}
/> */}
<ApplicationDrawer
  gym={selectedGym}
  processingAction={processingAction}
  onClose={() => {
    if (!processingAction) {
      setSelectedGym(null);
    }
  }}
  onApprove={async (id) => {
    const ok = window.confirm("Approve this gym?");
    if (!ok) return;

    try {
      setProcessingAction("approve");

      await approveApplication(id);
      await loadApplications();

      setSelectedGym(null);
    } catch (err) {
      console.log(err);
      alert("Failed to approve application");
    } finally {
      setProcessingAction(null);
    }
  }}
  onReject={async (id) => {
    const ok = window.confirm("Reject this application?");
    if (!ok) return;

    try {
      setProcessingAction("reject");

      await rejectApplication(id);
      await loadApplications();

      setSelectedGym(null);
    } catch (err) {
      console.log(err);
      alert("Failed to reject application");
    } finally {
      setProcessingAction(null);
    }
  }}
/>

</div>
  );
}
