import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; // Import Firebase auth & Firestore
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(""); // Will store user role (Customer or Agent)
  const navigate = useNavigate();

  // Fetch user role and tickets
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/"); // Redirect if no user is logged in
          return;
        }

        // Fetch user role from Firestore
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", user.email)
        );
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setUserRole(userData.role);
        }

        // Fetch tickets based on role
        let ticketQuery;
        if (userRole === "Agent") {
          ticketQuery = query(collection(db, "tickets"));
        } else {
          ticketQuery = query(
            collection(db, "tickets"),
            where("userEmail", "==", user.email)
          );
        }

        const ticketSnapshot = await getDocs(ticketQuery);
        const ticketsArray = ticketSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTickets(ticketsArray);
      } catch (err) {
        setError("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userRole, navigate]);

  // Handle ticket status update
  const handleTicketStatusUpdate = async (ticketId, status) => {
    try {
      const ticketRef = doc(db, "tickets", ticketId);
      await updateDoc(ticketRef, { status });
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status } : ticket
        )
      );
    } catch (err) {
      setError("Failed to update ticket status");
    }
  };

  // Logout function
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear(); 
    navigate("/");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded mb-4"
      >
        Logout
      </button>

      {/* Loading or Error Messages */}
      {loading ? (
        <p>Loading tickets...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          <h2 className="text-lg font-semibold">Tickets</h2>
          <ul>
            {tickets.map((ticket) => (
              <li key={ticket.id} className="border p-4 my-2 rounded">
                <h3 className="font-bold">{ticket.title}</h3>
                <p>{ticket.description}</p>
                <p>Status: {ticket.status}</p>

                {/* Agent Controls for Updating Ticket Status */}
                {userRole === "Agent" && (
                  <div className="mt-2">
                    <button
                      onClick={() =>
                        handleTicketStatusUpdate(ticket.id, "In Progress")
                      }
                      className="bg-blue-500 text-white p-2 rounded mr-2"
                    >
                      Set as In Progress
                    </button>
                    <button
                      onClick={() =>
                        handleTicketStatusUpdate(ticket.id, "Resolved")
                      }
                      className="bg-green-500 text-white p-2 rounded"
                    >
                      Resolve Ticket
                    </button>
                  </div>
                )}

                {/* Customers can only view their tickets */}
                {userRole === "Customer" && (
                  <button
                    className="bg-gray-500 text-white p-2 rounded mt-2"
                    disabled
                  >
                    You can only view your tickets
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
