import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { clearAuthData, getAuthData } from "../utils/auth";
import LogoutButton from "../components/LogoutButton";
import { FaUserCircle, FaExclamationTriangle } from "react-icons/fa";
import TransactionsList from "../components/TransactionsList.jsx";
import { v4 as uuid } from "uuid";

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
    currency: "USD", 
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
    if (account && showModal !== "deposit" && parseFloat(formData.amount) > account.balance) {
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
        toast.success("✅ Deposit successful!");
      }
      if (showModal === "withdraw") {
        await axios.post(
          "http://localhost:5000/dashboard/withdraw",
          { amount: parseFloat(formData.amount) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("✅ Withdrawal successful!");
      }
     if (showModal === "transfer") {
  let payload = { 
    amount: parseFloat(formData.amount), 
    transferType: formData.transferType,
    referenceId: uuid() // ✅ Prevent duplicate transfers
  };
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
         toast.success("✅ Transfer successful!");
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
      toast.error("❌ " + (err.response?.data?.error || "Something went wrong"));
    }
  };
  // Group transactions by date: Today, Yesterday, or full date
function groupTransactions(transactions) {
  const groups = {};
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  transactions.forEach((tx) => {
    const date = new Date(tx.timestamp);
    let groupLabel;

    if (date.toDateString() === today.toDateString()) {
      groupLabel = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupLabel = "Yesterday";
    } else {
      groupLabel = date.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }

    if (!groups[groupLabel]) groups[groupLabel] = [];
    groups[groupLabel].push(tx);
  });

  return groups;
}


  if (loading) return <p>Loading your dashboard...</p>;
  // ✅ Use grouped transaction display
  const grouped = groupTransactions(transactions);


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
      <div className="row g-4">

  {/* Profile Card */}
  <div className="col-lg-4">
    <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white">
      <FaUserCircle className="text-primary display-4 mb-3" />
      <h4 className="fw-bold">{user?.name}</h4>
      <p className="text-muted mb-1">{user?.email}</p>

      {account ? (
        <div className="mt-3">
          <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill border border-primary">
            Account: {account.accountNumber}
          </span>
        </div>
      ) : (
        <div className="alert alert-warning d-flex align-items-center gap-2 mt-3">
          <FaExclamationTriangle /> No Account Found
        </div>
      )}
    </div>
  </div>

  {/* Balance Light Card */}
<div className="col-lg-8">
  <div
    className="card border-0 shadow-sm rounded-4 p-0 overflow-hidden"
    style={{ background: "linear-gradient(135deg, #ffffff, #f3f6ff)" }}
  >
    <div className="p-4 d-flex flex-column justify-content-between" style={{ minHeight: "170px" }}>
      
      {/* Balance Text */}
      <div>
        <p className="text-uppercase text-muted small mb-1">Available Balance</p>
        <h1 className="fw-bold text-success mb-3">
          ${account?.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="d-flex align-items-center justify-content-start gap-3 mt-2">

        <button
          className="btn btn-outline-danger d-flex align-items-center gap-2 px-4 py-2 rounded-4 shadow-sm"
          onClick={() => setShowModal("withdraw")}
        >
          <i className="bi bi-arrow-down-circle"></i>
          Withdraw
        </button>

        <button
          className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 rounded-4 shadow-sm"
          onClick={() => setShowModal("transfer")}
        >
          <i className="bi bi-arrow-left-right"></i>
          Transfer
        </button>

      </div>
    </div>
  </div>
</div>


</div>
      {/* Transactions */}
      <div className="mt-4">
  <TransactionsList grouped={grouped} />
</div>

      {/* === Modal === */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 shadow-lg border-0">
              <form onSubmit={handleSubmitAction}>
                {/* Modal Header */}
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title text-capitalize fw-bold">{showModal}</h5>
                  <button
  type="button"
  className="btn-close btn-close-white"
  onClick={() => {
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
      currency: "USD",
    });
  }}
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
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">$</span>
                          <input
                            type="number"
                            step="0.01"
                            className="form-control border-start-0"
                            placeholder="Enter amount"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                          />
                        </div>
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
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">$</span>
                          <input
                            type="number"
                            step="0.01"
                            className="form-control border-start-0"
                            placeholder="Enter amount"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                          />
                        </div>
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

                      {/* LOCAL TRANSFER */}
                      {formData.transferType === "LOCAL" && (
                        <>
                          <div className="mb-3">
                            <label className="form-label">Bank Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter bank name"
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
                              placeholder="Enter recipient account number"
                              value={formData.accountNumber}
                              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Amount</label>
                            <div className="input-group">
                              <span className="input-group-text bg-light border-end-0">$</span>
                              <input
                                type="number"
                                step="0.01"
                                className="form-control border-start-0"
                                placeholder="Enter amount"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label text-muted">Recipient Email (Optional)</label>
                            <input
                              type="email"
                              className="form-control bg-transparent"
                              placeholder="you@example.com"
                              value={formData.recipientEmail}
                              onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                            />
                            <small className="text-secondary fst-italic">
                              Used for transfer notifications (optional)
                            </small>
                          </div>
                        </>
                      )}

                      {/* INTERNATIONAL TRANSFER */}
                      {formData.transferType === "INTL" && (
                        <>
                          <div className="mb-3">
                            <label className="form-label">Recipient Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter full name"
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
                              placeholder="Enter recipient bank"
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
                              placeholder="Enter IBAN"
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
                              placeholder="Enter SWIFT/BIC code"
                              value={formData.swiftCode}
                              onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Amount</label>
                            <div className="input-group">
                              <span className="input-group-text bg-light border-end-0">$</span>
                              <input
                                type="number"
                                step="0.01"
                                className="form-control border-start-0"
                                placeholder="Enter amount"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label text-muted">Recipient Email (Optional)</label>
                            <input
                              type="email"
                              className="form-control bg-transparent"
                              placeholder="you@example.com"
                              value={formData.recipientEmail}
                              onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                            />
                            <small className="text-secondary fst-italic">
                              For transfer confirmation (optional)
                            </small>
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
  onClick={() => {
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
      currency: "USD",
    });
  }}
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
