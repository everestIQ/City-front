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
      if (showModal === "deposit") {
        await deposit(parseFloat(formData.amount), formData.referenceId || uuid());
        toast.success("✅ Deposit successful!");
      }

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
            iban: formData.iban,
            swiftCode: formData.swiftCode,
            bankName: formData.bankName,
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
                  {/* Deposit, Withdraw, Transfer sections remain exactly the same */}
                  {/* ... (unchanged code from previous modal body) */}
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
