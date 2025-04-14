import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Notifications = () => {
  const { user } = useAuth();
  const [recentProjects, setRecentProjects] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/projects/notifications`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setRecentProjects(res.data.recentProjects);
        setActiveProjects(res.data.activeProjects);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        alert("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div>
      <h2>🔔 Notifications</h2>

      <section>
        <h3>🆕 New Projects (Last 15 Days)</h3>
        {recentProjects.length === 0 ? (
          <p>No new consultancy projects in the last 15 days.</p>
        ) : (
          <ul>
            {recentProjects.map((project) => (
              <li key={project.ID}>
                <strong>{project.projectTitle}</strong> from{" "}
                {project.industryName} on {new Date(project.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>🟢 Active Projects (Last 60 Days)</h3>
        {activeProjects.length === 0 ? (
          <p>No active consultancy projects in the last 60 days.</p>
        ) : (
          <ul>
            {activeProjects.map((project) => (
              <li key={project.ID}>
                <strong>{project.projectTitle}</strong> from{" "}
                {project.industryName} on {new Date(project.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Notifications;
