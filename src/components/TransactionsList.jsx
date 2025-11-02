import { useState } from "react";

export default function TransactionsList({ grouped }) {
  const [search, setSearch] = useState("");

  if (!grouped || Object.keys(grouped).length === 0) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
        <p className="text-muted">No transactions yet.</p>
      </div>
    );
  }

  const copyRef = (ref) => {
    navigator.clipboard.writeText(ref);
  };

  // Flatten → Filter → Regroup
  const allTransactions = Object.entries(grouped).flatMap(([date, txs]) =>
    txs.map((tx) => ({ ...tx, date }))
  );

  const filtered = allTransactions.filter((tx) =>
    (tx.referenceId && tx.referenceId.toLowerCase().includes(search.toLowerCase())) ||
    (tx.description && tx.description.toLowerCase().includes(search.toLowerCase())) ||
    tx.type.toLowerCase().includes(search.toLowerCase()) ||
    String(tx.amount).includes(search)
  );

  // Group back by date after filtering
  const regrouped = filtered.reduce((acc, tx) => {
    acc[tx.date] = acc[tx.date] || [];
    acc[tx.date].push(tx);
    return acc;
  }, {});

  return (
    <div className="card border-0 shadow-sm rounded-4">

      {/* ✅ Search Bar */}
      <div className="p-3 border-bottom bg-light">
        <input
          type="text"
          className="form-control rounded-pill"
          placeholder="Search: amount, type, reference ID, description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card-body p-0">
        {Object.entries(regrouped).length === 0 ? (
          <p className="text-center text-muted py-4">No matching transactions.</p>
        ) : (
          Object.entries(regrouped).map(([date, txs]) => (
            <div key={date} className="border-bottom p-3">
              <h6 className="fw-bold text-primary mb-3">{date}</h6>
              <table className="table align-middle table-hover mb-0">
                <tbody>
                  {txs.map((tx) => (
                    <tr key={tx.id}>
                      <td className="text-muted small" style={{ width: "25%" }}>
                        {new Date(tx.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="fw-semibold text-uppercase">{tx.type}</td>

                      <td>
                        {tx.type === "DEBIT" || tx.type === "TRANSFER" ? (
                          <span className="text-danger">- ₦{tx.amount.toLocaleString()}</span>
                        ) : (
                          <span className="text-success">+ ₦{tx.amount.toLocaleString()}</span>
                        )}
                      </td>

                      <td className="text-muted small">{tx.description || "—"}</td>

                      <td
                        className="text-muted small"
                        style={{ cursor: "pointer" }}
                        onClick={() => copyRef(tx.referenceId)}
                      >
                        {tx.referenceId ? tx.referenceId.slice(0, 8) + "..." : "—"}
                        <span className="text-primary ms-2" style={{ fontSize: "0.75rem" }}>
                          Copy
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
