import { useState, useEffect } from "react";
import axios from "axios";
import { getAuthData } from "../utils/auth";

export default function UsersTable({ onCredit }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    otherName: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    role: "CUSTOMER",
  });

  const [editUser, setEditUser] = useState(null);
  const auth = getAuthData();
  const token = auth?.token;

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleError = (err, fallbackMessage) => {
    console.error("Admin error:", err);
    setMessage("❌ " + (err.response?.data?.error || fallbackMessage));
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
      setFilteredUsers(res.data.users);
    } catch (err) {
      handleError(err, "Failed to fetch users");
    }
  };

  const createUser = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/admin/users",
        newUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ " + res.data.message);
      setShowCreateModal(false);
      setNewUser({
        firstName: "",
        lastName: "",
        otherName: "",
        email: "",
        phone: "",
        dob: "",
        password: "",
        role: "CUSTOMER",
      });
      fetchUsers();
    } catch (err) {
      handleError(err, "Failed to create user");
    }
  };

  const updateUser = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/admin/users/${editUser.id}`,
        editUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ " + res.data.message);
      setShowEditModal(false);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      handleError(err, "Failed to update user");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await axios.delete(
        `http://localhost:5000/admin/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ " + res.data.message);
      fetchUsers();
    } catch (err) {
      handleError(err, "Failed to delete user");
    }
  };

  const handleSearch = (query) => {
    if (!query) {
      setFilteredUsers(users);
      return;
    }
    const lower = query.toLowerCase();
    setFilteredUsers(
      users.filter(
        (u) =>
          `${u.firstName} ${u.lastName} ${u.otherName || ""}`
            .toLowerCase()
            .includes(lower) ||
          u.email?.toLowerCase().includes(lower) ||
          u.phone?.toLowerCase().includes(lower)
      )
    );
  };

  const handleFilter = (role) => {
    if (role === "ALL") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((u) => u.role === role));
    }
  };

  return (
    <div>
      <h3>👥 Users</h3>
      {message && <p>{message}</p>}

      <div style={{ marginBottom: "15px" }}>
        <button
          style={{ marginRight: "10px" }}
          onClick={() => setShowCreateModal(true)}
        >
          ➕ Create User
        </button>

        <input
          type="text"
          placeholder="Search by name/email/phone..."
          onChange={(e) => handleSearch(e.target.value)}
          style={{ padding: "6px", marginRight: "10px" }}
        />

        <select onChange={(e) => handleFilter(e.target.value)}>
          <option value="ALL">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="CUSTOMER">Customer</option>
        </select>
      </div>

      {/* Users Table */}
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>DOB</th>
            <th>Role</th>
            <th>Accounts</th>
            <th>Total Balance</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>
                  {u.firstName} {u.lastName} {u.otherName || ""}
                </td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.dob ? new Date(u.dob).toLocaleDateString() : "-"}</td>
                <td>{u.role}</td>
                <td>{u.accounts?.length || 0}</td>
                <td>
                  $
                  {u.accounts
                    ?.reduce((sum, acc) => sum + (acc.balance || 0), 0)
                    .toFixed(2) || "0.00"}
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditUser(u);
                      setShowEditModal(true);
                    }}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => deleteUser(u.id)}
                    style={{ marginLeft: "5px", color: "red" }}
                  >
                    🗑 Delete
                  </button>

                  {/* ✅ Add Funds Button */}
                  {onCredit && (
                    <button
                      onClick={() => {
                        // If user has multiple accounts, pick first for now
                        const account =
                          u.accounts && u.accounts.length > 0
                            ? u.accounts[0]
                            : null;
                        if (!account)
                          return alert(
                            "This user has no account to credit."
                          );
                        onCredit(account);
                      }}
                      style={{
                        marginLeft: "5px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "5px 8px",
                        cursor: "pointer",
                      }}
                    >
                      💰 Add Funds
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No users found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* CREATE USER MODAL */}
      {showCreateModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Create User</h3>
            <label>First Name:</label>
            <input
              type="text"
              value={newUser.firstName}
              onChange={(e) =>
                setNewUser({ ...newUser, firstName: e.target.value })
              }
            />
            <br />
            <label>Last Name:</label>
            <input
              type="text"
              value={newUser.lastName}
              onChange={(e) =>
                setNewUser({ ...newUser, lastName: e.target.value })
              }
            />
            <br />
            <label>Other Name:</label>
            <input
              type="text"
              value={newUser.otherName}
              onChange={(e) =>
                setNewUser({ ...newUser, otherName: e.target.value })
              }
            />
            <br />
            <label>Email:</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <br />
            <label>Phone:</label>
            <input
              type="text"
              value={newUser.phone}
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
            />
            <br />
            <label>Date of Birth:</label>
            <input
              type="date"
              value={newUser.dob}
              onChange={(e) =>
                setNewUser({ ...newUser, dob: e.target.value })
              }
            />
            <br />
            <label>Password:</label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            <br />
            <label>Role:</label>
            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
            >
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>
            <br />
            <div style={{ marginTop: "10px" }}>
              <button onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button onClick={createUser}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {showEditModal && editUser && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Edit User</h3>
            <label>First Name:</label>
            <input
              type="text"
              value={editUser.firstName}
              onChange={(e) =>
                setEditUser({ ...editUser, firstName: e.target.value })
              }
            />
            <br />
            <label>Last Name:</label>
            <input
              type="text"
              value={editUser.lastName}
              onChange={(e) =>
                setEditUser({ ...editUser, lastName: e.target.value })
              }
            />
            <br />
            <label>Other Name:</label>
            <input
              type="text"
              value={editUser.otherName || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, otherName: e.target.value })
              }
            />
            <br />
            <label>Email:</label>
            <input
              type="email"
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
            />
            <br />
            <label>Phone:</label>
            <input
              type="text"
              value={editUser.phone || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, phone: e.target.value })
              }
            />
            <br />
            <label>Date of Birth:</label>
            <input
              type="date"
              value={editUser.dob ? editUser.dob.substring(0, 10) : ""}
              onChange={(e) =>
                setEditUser({ ...editUser, dob: e.target.value })
              }
            />
            <br />
            <label>Role:</label>
            <select
              value={editUser.role}
              onChange={(e) =>
                setEditUser({ ...editUser, role: e.target.value })
              }
            >
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>
            <br />
            <div style={{ marginTop: "10px" }}>
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
              <button onClick={updateUser}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Modal Styles */
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalContent = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  width: "400px",
};
