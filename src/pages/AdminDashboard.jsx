import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearAuthData, getAuthData } from "../utils/auth";
import LogoutButton from "../components/LogoutButton";
import UsersTable from "../components/UsersTable";
import TransactionsTable from "../components/TransactionsTable";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [suspended, setSuspended] = useState(false);

  const navigate = useNavigate();
  const auth = getAuthData();
  const token = auth?.token;

  useEffect(() => {
    if (!auth) navigate("/admin-login");
  }, [auth, navigate]);

  const handleError = (err, fallbackMessage) => {
    console.error("Admin error:", err);
    if (err.response?.status === 401) {
      clearAuthData();
      navigate("/admin-login");
    } else {
      setMessage("❌ " + (err.response?.data?.error || fallbackMessage));
    }
  };

  // ---- FETCH DATA ----
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
    } catch (err) {
      handleError(err, "Failed to fetch users");
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data.transactions);
    } catch (err) {
      handleError(err, "Failed to fetch transactions");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTransactions();
  }, []);

  // ---- USER ACTIONS ----
  const changeRole = async (id, newRole) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/admin/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ " + res.data.message);
      fetchUsers();
    } catch (err) {
      handleError(err, "Failed to update role");
    }
  };

  const saveUser = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/admin/users/${selectedUser.id}`,
        selectedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ " + res.data.message);
      setSelectedUser(null);
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

  // ---- TRANSACTION ACTIONS ----
  const saveTransaction = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/admin/transactions/${selectedTransaction.id}`,
        selectedTransaction,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ " + res.data.message);
      setSelectedTransaction(null);
      fetchTransactions();
    } catch (err) {
      handleError(err, "Failed to update transaction");
    }
  };

  const createTransaction = async (newTransaction) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/admin/transactions",
        newTransaction,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ " + res.data.message);
      fetchTransactions();
    } catch (err) {
      handleError(err, "Failed to create transaction");
    }
  };

  // ---- ADD FUNDS ----
  const openCreditModal = (account) => {
    setSelectedAccount(account);
    setShowCreditModal(true);
  };

  const handleCredit = async () => {
    if (!amount || !selectedAccount) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/admin/credit",
        {
          accountNumber: selectedAccount.accountNumber,
          amount: parseFloat(amount),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ " + res.data.message);
      setAmount("");
      setShowCreditModal(false);
      fetchUsers();
    } catch (err) {
      handleError(err, "Failed to credit account");
    }
  };

  // ---- SUSPEND SYSTEM ----
  const toggleSuspend = () => {
    setSuspended(!suspended);
    setMessage(
      suspended
        ? "✅ Transactions resumed."
        : "⚠️ Transactions temporarily suspended for verification."
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>👑 Admin Dashboard</h2>
      <LogoutButton />

      {/* Control buttons */}
      <div style={{ margin: "15px 0", display: "flex", gap: "10px" }}>
        <button
          onClick={() => setActiveTab("users")}
          style={{
            background: activeTab === "users" ? "#007bff" : "#ccc",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Manage Users
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          style={{
            background: activeTab === "transactions" ? "#007bff" : "#ccc",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          View Transactions
        </button>
        <button
          onClick={toggleSuspend}
          style={{
            background: suspended ? "#dc3545" : "#28a745",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {suspended ? "Resume Transactions" : "Suspend Transactions"}
        </button>
      </div>

      {message && <p style={{ fontWeight: "bold" }}>{message}</p>}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <UsersTable
          users={users}
          onChangeRole={changeRole}
          onEdit={setSelectedUser}
          onDelete={deleteUser}
          onCredit={openCreditModal} // ✅ Add fund option
        />
      )}

      {/* TRANSACTIONS TAB */}
      {activeTab === "transactions" && (
        <TransactionsTable
          transactions={transactions}
          onEdit={setSelectedTransaction}
          onSave={saveTransaction}
          onCreate={createTransaction}
        />
      )}

      {/* CREDIT MODAL */}
      {showCreditModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Add Funds to Account</h3>
            <p>
              <strong>Account Number:</strong>{" "}
              {selectedAccount?.accountNumber}
            </p>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
            />
            <button
              onClick={handleCredit}
              style={{
                background: "#007bff",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
                marginRight: "10px",
              }}
            >
              Confirm
            </button>
            <button
              onClick={() => setShowCreditModal(false)}
              style={{
                background: "#6c757d",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {selectedUser && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Edit User</h3>
            <input
              type="text"
              value={selectedUser.firstName}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, firstName: e.target.value })
              }
              placeholder="First Name"
            />
            <input
              type="text"
              value={selectedUser.lastName}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, lastName: e.target.value })
              }
              placeholder="Last Name"
            />
            <input
              type="email"
              value={selectedUser.email}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
              placeholder="Email"
            />
            <div style={{ marginTop: "10px" }}>
              <button onClick={saveUser}>Save</button>
              <button onClick={() => setSelectedUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Simple modal styles */
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
  zIndex: 1000,
};

const modalContent = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "400px",
};
