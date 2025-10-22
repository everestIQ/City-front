import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearAuthData, getAuthData } from "../utils/auth";
import LogoutButton from "../components/LogoutButton";
import { FaUserCircle, FaExclamationTriangle } from "react-icons/fa";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    recipientEmail: "",
    transferType: "",
    bankName: "",
    accountNumber: "",
    swiftCode: "",
    iban: "",
    recipientName: "",
    depositMethod: "",
    referenceId: "",
    withdrawMethod: "",
    destinationAccount: "",
  });
  const navigate = useNavigate();

  const auth = getAuthData();
  const token = auth?.token;

  const fetchDashboard = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.user);
      setAccount(res.data.account || null);
      setTransactions(res.data.transactions || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        clearAuthData();
        navigate("/login");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [token, navigate]);

  // === ACTION HANDLER ===
  const handleSubmitAction = async (e) => {
    e.preventDefault();

    if (parseFloat(formData.amount) <= 0) {
      alert("Amount must be greater than zero");
      return;
    }
    if (account && parseFloat(formData.amount) > account.balance) {
      alert("Insufficient funds");
      return;
    }

    try {
      if (showModal === "deposit") {
        await axios.post(
          "http://localhost:5000/dashboard/deposit",
          { amount: parseFloat(formData.amount) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Deposit successful");
      }
      if (showModal === "withdraw") {
        await axios.post(
          "http://localhost:5000/dashboard/withdraw",
          { amount: parseFloat(formData.amount) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Withdrawal successful");
      }
      if (showModal === "transfer") {
        let payload = { amount: parseFloat(formData.amount), transferType: formData.transferType };

        if (formData.transferType === "LOCAL") {
          payload = {
            ...payload,
            recipientEmail: formData.recipientEmail,
            accountNumber: formData.accountNumber,
            bankName: formData.bankName,
          };
        } else if (formData.transferType === "INTL") {
          payload = {
            ...payload,
            recipientName: formData.recipientName,
            iban: formData.iban,
            swiftCode: formData.swiftCode,
            bankName: formData.bankName,
          };
        }

        await axios.post("http://localhost:5000/dashboard/transfer", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Transfer successful");
      }

      setShowModal(null);
      setFormData({
        amount: "",
        recipientEmail: "",
        transferType: "",
        bankName: "",
        accountNumber: "",
        swiftCode: "",
        iban: "",
        recipientName: "",
        depositMethod: "",
        referenceId: "",
        withdrawMethod: "",
        destinationAccount: "",
      });
      fetchDashboard();
    } catch (err) {
      alert("Failed: " + (err.response?.data?.error || "Something went wrong"));
    }
  };

  if (loading) return <p>Loading your dashboard...</p>;

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="d-flex align-items-center gap-2">
          <FaUserCircle className="text-primary" /> Welcome back, {user?.name}
        </h2>
        <LogoutButton />
      </div>

      {/* Account Info */}
      <div className="card my-3 p-3 shadow-sm">
        <h4>Account Overview</h4>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        <p><strong>Member Since:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
        {account ? (
          <>
            <p><strong>Account Number:</strong> {account.accountNumber}</p>
            <h5 className="mt-3">Balance</h5>
            <p className="fs-3 text-success">${account.balance.toFixed(2)}</p>
          </>
        ) : (
          <div className="alert alert-warning d-flex align-items-center gap-2">
            <FaExclamationTriangle /> No account found
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card my-3 p-3 shadow-sm">
        <h4>Quick Actions</h4>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-success" onClick={() => setShowModal("deposit")}>Deposit</button>
          <button className="btn btn-warning" onClick={() => setShowModal("withdraw")}>Withdraw</button>
          <button className="btn btn-primary" onClick={() => setShowModal("transfer")}>Transfer</button>
        </div>
      </div>

      {/* Transactions */}
      <div className="card p-3 shadow-sm">
        <h4>Recent Transactions</h4>
        {transactions.length === 0 ? (
          <p className="text-muted">No recent transactions.</p>
        ) : (
          <ul className="list-group">
            {transactions.map((tx) => (
              <li key={tx.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <span className="fw-bold">{tx.type}</span> - {tx.description}
                  <br />
                  <small className="text-muted">{new Date(tx.createdAt).toLocaleString()}</small>
                </div>
                <span className={`badge rounded-pill ${tx.type === "DEBIT" ? "bg-danger" : "bg-success"} fs-6`}>
                  {tx.type === "DEBIT" ? "-" : "+"}${tx.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* === Modal === */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 shadow-lg border-0">
              <form onSubmit={handleSubmitAction} onReset={() => setFormData({
                amount: "",
                recipientEmail: "",
                transferType: "",
                bankName: "",
                accountNumber: "",
                swiftCode: "",
                iban: "",
                recipientName: "",
                depositMethod: "",
                referenceId: "",
                withdrawMethod: "",
                destinationAccount: "",
              })}>
                {/* Modal Header */}
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title text-capitalize fw-bold">{showModal}</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(null)}
                  />
                </div>

                {/* Modal Body */}
                <div className="modal-body p-4">
                  {/* Deposit */}
                  {showModal === "deposit" && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Deposit Method</label>
                        <select
                          className="form-select"
                          value={formData.depositMethod}
                          onChange={(e) => setFormData({ ...formData, depositMethod: e.target.value })}
                          required
                        >
                          <option value="">-- Select Method --</option>
                          <option value="BANK_TRANSFER">Bank Transfer</option>
                          <option value="CARD">Card Payment</option>
                          <option value="CASH">Cash Deposit</option>
                          <option value="MOBILE">Mobile Money</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Reference ID</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.referenceId}
                          onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* Withdraw */}
                  {showModal === "withdraw" && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Withdrawal Method</label>
                        <select
                          className="form-select"
                          value={formData.withdrawMethod}
                          onChange={(e) => setFormData({ ...formData, withdrawMethod: e.target.value })}
                          required
                        >
                          <option value="">-- Select Method --</option>
                          <option value="BANK">Bank Account</option>
                          <option value="ATM">ATM Withdrawal</option>
                          <option value="MOBILE">Mobile Money</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Destination Account / Bank</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.destinationAccount}
                          onChange={(e) => setFormData({ ...formData, destinationAccount: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* Transfer */}
                  {showModal === "transfer" && (
                    <>
                      {!formData.transferType && (
                        <div className="mb-3">
                          <label className="form-label">Transfer Type</label>
                          <select
                            className="form-select"
                            value={formData.transferType}
                            onChange={(e) => setFormData({ ...formData, transferType: e.target.value })}
                            required
                          >
                            <option value="">-- Select --</option>
                            <option value="LOCAL">Local Transfer</option>
                            <option value="INTL">International Transfer</option>
                          </select>
                        </div>
                      )}

                      {formData.transferType === "LOCAL" && (
                        <>
                          <div className="mb-3">
                            <label className="form-label">Recipient Email</label>
                            <input
                              type="email"
                              className="form-control"
                              value={formData.recipientEmail}
                              onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Bank Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.bankName}
                              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Account Number</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.accountNumber}
                              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Amount</label>
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={formData.amount}
                              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                              required
                            />
                          </div>
                        </>
                      )}

                      {formData.transferType === "INTL" && (
                        <>
                          <div className="mb-3">
                            <label className="form-label">Recipient Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.recipientName}
                              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Bank Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.bankName}
                              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">IBAN</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.iban}
                              onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">SWIFT Code</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.swiftCode}
                              onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Amount</label>
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={formData.amount}
                              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                              required
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => setShowModal(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={
                      (showModal === "transfer" && !formData.transferType) ||
                      (showModal === "deposit" && !formData.depositMethod) ||
                      (showModal === "withdraw" && !formData.withdrawMethod)
                    }
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
