import { useState, useEffect } from "react";
import axios from "axios";
import { getAuthData } from "../utils/auth";

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTx, setFilteredTx] = useState([]);
  const [message, setMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    userId: "",
    type: "DEPOSIT",
    amount: 0,
    method: "",
    bankAccount: "",
    note: "",
  });

  const auth = getAuthData();
  const token = auth?.token;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleError = (err, fallbackMessage) => {
    console.error("Admin error:", err);
    setMessage("❌ " + (err.response?.data?.error || fallbackMessage));
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data.transactions);
      setFilteredTx(res.data.transactions);
    } catch (err) {
      handleError(err, "Failed to fetch transactions");
    }
  };

  const createTransaction = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/admin/transactions",
        newTransaction,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ " + res.data.message);
      setShowCreateModal(false);
      setNewTransaction({
        userId: "",
        type: "DEPOSIT",
        amount: 0,
        method: "",
        bankAccount: "",
        note: "",
      });
      fetchTransactions();
    } catch (err) {
      handleError(err, "Failed to create transaction");
    }
  };

  const handleSearch = (query) => {
    if (!query) {
      setFilteredTx(transactions);
      return;
    }
    const lower = query.toLowerCase();
    setFilteredTx(
      transactions.filter(
        (tx) =>
          tx.user?.name?.toLowerCase().includes(lower) ||
          tx.user?.email?.toLowerCase().includes(lower)
      )
    );
  };

  const handleFilter = (status) => {
    if (status === "ALL") {
      setFilteredTx(transactions);
    } else {
      setFilteredTx(transactions.filter((tx) => tx.status === status));
    }
  };

  return (
    <div>
      <h3>📊 Transactions</h3>
      {message && <p>{message}</p>}

      <div style={{ marginBottom: "15px" }}>
        <button
          style={{ marginRight: "10px" }}
          onClick={() => setShowCreateModal(true)}
        >
          ➕ Create Transaction
        </button>

        <input
          type="text"
          placeholder="Search by user/email..."
          onChange={(e) => handleSearch(e.target.value)}
          style={{ padding: "6px", marginRight: "10px" }}
        />

        <select onChange={(e) => handleFilter(e.target.value)}>
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Transactions Table */}
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Email</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Method</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredTx.length > 0 ? (
            filteredTx.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.id}</td>
                <td>{tx.user?.name || "N/A"}</td>
                <td>{tx.user?.email || "N/A"}</td>
                <td>{tx.type}</td>
                <td>${tx.amount.toFixed(2)}</td>
                <td>{tx.status}</td>
                <td>{tx.method || "-"}</td>
                <td>{new Date(tx.createdAt).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* CREATE TRANSACTION MODAL */}
      {showCreateModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Create Transaction</h3>
            <label>User ID:</label>
            <input
              type="text"
              value={newTransaction.userId}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, userId: e.target.value })
              }
            />
            <br />
            <label>Type:</label>
            <select
              value={newTransaction.type}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, type: e.target.value })
              }
            >
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAWAL">Withdrawal</option>
            </select>
            <br />
            <label>Amount:</label>
            <input
              type="number"
              value={newTransaction.amount}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  amount: Number(e.target.value),
                })
              }
            />
            <br />
            <label>Method/Bank:</label>
            <input
              type="text"
              value={newTransaction.method}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  method: e.target.value,
                })
              }
              placeholder="Optional: Bank/Method"
            />
            <br />
            <label>Note:</label>
            <input
              type="text"
              value={newTransaction.note}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  note: e.target.value,
                })
              }
              placeholder="Optional note"
            />
            <br />
            <div style={{ marginTop: "10px" }}>
              <button onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button onClick={createTransaction}>Create</button>
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
