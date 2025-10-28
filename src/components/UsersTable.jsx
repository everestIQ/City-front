import { useState, useEffect } from "react";
import axios from "axios";
import { getAuthData } from "../utils/auth";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState(null);

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

  // ✅ Add funds to user account
  const handleAddFunds = async () => {
    if (!fundAmount || isNaN(fundAmount)) {
      setMessage("❌ Enter a valid amount.");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/admin/fund",
        { accountId: selectedAccountId, amount: parseFloat(fundAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ " + res.data.message);
      setShowFundModal(false);
      setFundAmount("");
      setSelectedAccountId(null);
      fetchUsers();
    } catch (err) {
      handleError(err, "Failed to add funds");
    }
  };

  // ✅ Suspend or reactivate transactions
  const toggleTransactionStatus = async (userId, isSuspended) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/admin/users/${userId}/suspend`,
        { suspend: !isSuspended },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ " + res.data.message);
      fetchUsers();
    } catch (err) {
      handleError(err, "Failed to update transaction status");
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
        <button onClick={() => setShowCreateModal(true)}>➕ Create User</button>

        <input
          type="text"
          placeholder="Search by name/email/phone..."
          onChange={(e) => handleSearch(e.target.value)}
          style={{ padding: "6px", margin: "0 10px" }}
        />

        <select onChange={(e) => handleFilter(e.target.value)}>
          <option value="ALL">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="CUSTOMER">Customer</option>
        </select>
      </div>

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
            <th>Status</th>
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
                <td>
                  {u.suspended ? (
                    <span style={{ color: "red" }}>Suspended</span>
                  ) : (
                    <span style={{ color: "green" }}>Active</span>
                  )}
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
                    style={{ marginLeft: "5px", color: "green" }}
                    onClick={() => {
                      const acc = u.accounts?.[0];
                      if (acc) {
                        setSelectedAccountId(acc.id);
                        setShowFundModal(true);
                      } else {
                        setMessage("⚠️ No account found for this user.");
                      }
                    }}
                  >
                    💰 Add Fund
                  </button>
                  <button
                    style={{
                      marginLeft: "5px",
                      color: u.suspended ? "green" : "red",
                    }}
                    onClick={() => toggleTransactionStatus(u.id, u.suspended)}
                  >
                    {u.suspended ? "✅ Reactivate" : "🚫 Suspend"}
                  </button>
                  <button
                    onClick={() => deleteUser(u.id)}
                    style={{ marginLeft: "5px", color: "red" }}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No users found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* FUND MODAL */}
      {showFundModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Add Funds</h3>
            <input
              type="number"
              placeholder="Enter amount"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
            />
            <div style={{ marginTop: "10px" }}>
              <button onClick={() => setShowFundModal(false)}>Cancel</button>
              <button onClick={handleAddFunds}>Add Funds</button>
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
