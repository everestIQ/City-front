import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API, { getDashboard, deposit, withdraw, transfer } from "../api";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
  amount: "",
  recipientEmail: "",
  transferType: "",
  bankName: "",
  accountNumber: "",
  swiftCode: "",
  iban: "",
  recipientName: "",
  recipientAddress: "",
  bankAddress: "",
  routingNumber: "",
  purpose: "",
  remark: "",
  depositMethod: "",
  referenceId: "",
  withdrawMethod: "",
  destinationAccount: "",
  currency: "USD",
});

  const navigate = useNavigate();
  const auth = getAuthData();
  const token = auth?.token;
  
  
  /* ---------------- FETCH DASHBOARD ---------------- */
  const fetchDashboard = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await getDashboard();
          // 👇 ADD THIS LINE RIGHT HERE
    console.log("ACCOUNT FROM API:", res.data.account);
    console.log("RENDER CHECK → account:", res.data.account);


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
  }, [token]);



  /* ---------------- ACTION HANDLER ---------------- */
  const handleSubmitAction = async (e) => {
  e.preventDefault();

  if (isSubmitting) return; // 🚨 BLOCK DUPLICATES
  setIsSubmitting(true);

  console.log("TRANSFER SUBMITTING");

      // 🔒 BLOCK ACTIONS IF SUSPENDED
  if (isSuspended && showModal !== "deposit") {
    toast.error(suspensionMessage);
    return;
  }
  
    if (parseFloat(formData.amount) <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }

    if (
      account &&
      showModal !== "deposit" &&
      parseFloat(formData.amount) > account.balance
    ) {
      toast.error("Insufficient funds");
      return;
    }

    try {
      // if (showModal === "deposit") {
      //   await deposit(parseFloat(formData.amount), formData.referenceId || uuid());
      //   toast.success("✅ Deposit successful!");
      // }

      if (showModal === "withdraw") {
        await withdraw(parseFloat(formData.amount));
        toast.success("✅ Withdrawal successful!");
      }

      if (showModal === "transfer") {
        let payload = {
          amount: parseFloat(formData.amount),
          transferType: formData.transferType,
          referenceId: uuid(),
        };

        if (formData.transferType === "LOCAL") {
          payload = {
            ...payload,
            recipientEmail: formData.recipientEmail,
            accountNumber: formData.accountNumber,
            bankName: formData.bankName,
          };
        }

if (formData.transferType === "INTL") {
  payload = {
    ...payload,
    recipientName: formData.recipientName,
    recipientAddress: formData.recipientAddress,
    bankName: formData.bankName,
    bankAddress: formData.bankAddress,
    iban: formData.iban,
    swiftCode: formData.swiftCode,
    routingNumber: formData.routingNumber,
    purpose: formData.purpose,
    remark: formData.remark,
    currency: formData.currency,
  };
}

        await transfer(payload);
        toast.success("✅ Transfer successful!");
      }

      // Reset modal and form
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

      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    }
  };

  /* ---------------- TRANSACTION GROUPING ---------------- */
  function groupTransactions(transactions) {
    const groups = {};
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    transactions.forEach((tx) => {
      const date = new Date(tx.timestamp);
      let label;

      if (date.toDateString() === today.toDateString()) label = "Today";
      else if (date.toDateString() === yesterday.toDateString()) label = "Yesterday";
      else {
        label = date.toLocaleDateString(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      }

      if (!groups[label]) groups[label] = [];
      groups[label].push(tx);
    });

    return groups;
  }

  if (loading) return <p>Loading your dashboard...</p>;
  const grouped = groupTransactions(transactions);

  // 🔒 Account suspension state
const isSuspended = account?.suspended === true;
const suspensionMessage =
  account?.suspensionMessage || "Your account is currently suspended.";


  /* ---------------- UI ---------------- */
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="d-flex align-items-center gap-2">
          <FaUserCircle className="text-primary" /> Welcome back, {user?.name}
        </h2>
        <LogoutButton />
      </div>
      {/* 🔴 ACCOUNT SUSPENSION BANNER */}
{isSuspended && (
  <div className="alert alert-danger d-flex align-items-start gap-2">
    <FaExclamationTriangle className="mt-1" />
    <div>
      <strong>Account Suspended</strong>
      <div className="small">
        {suspensionMessage}
      </div>
    </div>
  </div>
)}


      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm p-4 text-center">
            <FaUserCircle className="text-primary display-4 mb-3" />
            <h4>{user?.name}</h4>
            <p className="text-muted">{user?.email}</p>

            {account ? (
              <span className="badge bg-primary">
                Account: {account.accountNumber}
              </span>
            ) : (
              <div className="alert alert-warning mt-3">
                <FaExclamationTriangle /> No Account Found
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm p-4">
            <p className="text-muted">Available Balance</p>
            <h1 className="text-success fw-bold">
              ${account?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h1>

            <div className="d-flex gap-3 mt-3">
             <button
    className="btn btn-outline-danger"
    disabled={isSuspended}
    onClick={() => setShowModal("withdraw")}
  >
    Withdraw
  </button>

  <button
    type="button"
    className="btn btn-primary"
    disabled={isSuspended}
    onClick={() => setShowModal("transfer")}
  >
    Transfer
  </button>
</div>
          </div>
        </div>
      </div>

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

  {/* Transfer Type */}
  <div className="mb-3">
    <label className="form-label">Transfer Type</label>
    <select
      className="form-select"
      value={formData.transferType}
      onChange={(e) =>
        setFormData({
          ...formData,
          transferType: e.target.value,
        })
      }
      required
    >
      <option value="">Select Transfer Type</option>
      <option value="LOCAL">Local Transfer</option>
      <option value="INTL">International Transfer</option>
    </select>
  </div>

  {/* Amount */}
  <div className="mb-3">
    <label className="form-label">Amount</label>
    <input
      type="number"
      className="form-control"
      value={formData.amount}
      onChange={(e) =>
        setFormData({
          ...formData,
          amount: e.target.value,
        })
      }
      required
    />
  </div>

  {/* ================= LOCAL TRANSFER ================= */}
  {formData.transferType === "LOCAL" && (
    <>
      <div className="mb-3">
        <label className="form-label">Bank Name</label>
        <input
          type="text"
          className="form-control"
          value={formData.bankName}
          onChange={(e) =>
            setFormData({
              ...formData,
              bankName: e.target.value,
            })
          }
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Account Number</label>
        <input
          type="text"
          className="form-control"
          value={formData.accountNumber}
          onChange={(e) =>
            setFormData({
              ...formData,
              accountNumber: e.target.value,
            })
          }
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Recipient Email (Optional)</label>
        <input
          type="email"
          className="form-control"
          value={formData.recipientEmail}
          onChange={(e) =>
            setFormData({
              ...formData,
              recipientEmail: e.target.value,
            })
          }
        />
      </div>
    </>
  )}

  {/* ================= INTERNATIONAL TRANSFER ================= */}
{formData.transferType === "INTL" && (
  <>
    <h6 className="fw-bold text-primary mb-3">
      Beneficiary Information
    </h6>

    <div className="mb-3">
      <label className="form-label">Recipient Name</label>
      <input
        type="text"
        className="form-control"
        value={formData.recipientName}
        onChange={(e) =>
          setFormData({
            ...formData,
            recipientName: e.target.value,
          })
        }
        required
      />
    </div>

    <div className="mb-3">
      <label className="form-label">Recipient Address</label>
      <textarea
        className="form-control"
        rows="2"
        value={formData.recipientAddress}
        onChange={(e) =>
          setFormData({
            ...formData,
            recipientAddress: e.target.value,
          })
        }
      />
    </div>

    <h6 className="fw-bold text-primary mb-3 mt-4">
      Bank Information
    </h6>

    <div className="mb-3">
      <label className="form-label">Bank Name</label>
      <input
        type="text"
        className="form-control"
        value={formData.bankName}
        onChange={(e) =>
          setFormData({
            ...formData,
            bankName: e.target.value,
          })
        }
        required
      />
    </div>

    <div className="mb-3">
      <label className="form-label">Bank Address</label>
      <textarea
        className="form-control"
        rows="2"
        value={formData.bankAddress}
        onChange={(e) =>
          setFormData({
            ...formData,
            bankAddress: e.target.value,
          })
        }
      />
    </div>

    <div className="mb-3">
      <label className="form-label">IBAN</label>
      <input
        type="text"
        className="form-control"
        value={formData.iban}
        onChange={(e) =>
          setFormData({
            ...formData,
            iban: e.target.value,
          })
        }
        required
      />
    </div>

    <div className="mb-3">
      <label className="form-label">SWIFT / BIC Code</label>
      <input
        type="text"
        className="form-control"
        value={formData.swiftCode}
        onChange={(e) =>
          setFormData({
            ...formData,
            swiftCode: e.target.value,
          })
        }
        required
      />
    </div>

    <div className="mb-3">
      <label className="form-label">
        Routing Number (Optional)
      </label>
      <input
        type="text"
        className="form-control"
        value={formData.routingNumber}
        onChange={(e) =>
          setFormData({
            ...formData,
            routingNumber: e.target.value,
          })
        }
      />
    </div>

    <div className="mb-3">
      <label className="form-label">Currency</label>
      <select
        className="form-select"
        value={formData.currency}
        onChange={(e) =>
          setFormData({
            ...formData,
            currency: e.target.value,
          })
        }
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
        <option value="CAD">CAD</option>
        <option value="AUD">AUD</option>
        <option value="CHF">CHF</option>
        <option value="JPY">JPY</option>
      </select>
    </div>

    <div className="mb-3">
      <label className="form-label">
        Purpose of Payment
      </label>
      <select
        className="form-select"
        value={formData.purpose}
        onChange={(e) =>
          setFormData({
            ...formData,
            purpose: e.target.value,
          })
        }
      >
        <option value="">Select Purpose</option>
        <option value="Family Support">
          Family Support
        </option>
        <option value="Business Payment">
          Business Payment
        </option>
        <option value="Tuition Fees">
          Tuition Fees
        </option>
        <option value="Medical Expenses">
          Medical Expenses
        </option>
        <option value="Property Purchase">
          Property Purchase
        </option>
        <option value="Investment">
          Investment
        </option>
        <option value="Personal Transfer">
          Personal Transfer
        </option>
      </select>
    </div>

    <div className="mb-3">
      <label className="form-label">
        Transfer Remark
      </label>
      <textarea
        className="form-control"
        rows="2"
        value={formData.remark}
        onChange={(e) =>
          setFormData({
            ...formData,
            remark: e.target.value,
          })
        }
      />
    </div>
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
  isSuspended ||
  isSubmitting ||
  !formData.amount ||
  (showModal === "transfer" && !formData.transferType) ||
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
