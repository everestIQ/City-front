import { FaArrowDown, FaArrowUp } from "react-icons/fa";

export default function TransactionsList({ grouped }) {
  return (
    <div className="card p-3 shadow-sm mt-4">
      <h4 className="mb-3">Recent Transactions</h4>

      {Object.keys(grouped).length === 0 && (
        <p className="text-muted">No transactions yet</p>
      )}

      {Object.entries(grouped).map(([date, items]) => (
        <div key={date} className="mb-4">
          <h6 className="text-secondary fw-bold mb-2">{date}</h6>
          <ul className="list-group">
            {items.map((tx) => (
              <li key={tx.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  {tx.type === "DEPOSIT" ? (
                    <FaArrowDown className="text-success" />
                  ) : (
                    <FaArrowUp className="text-danger" />
                  )}
                  <span className="fw-semibold text-capitalize">{tx.type.toLowerCase()}</span>
                </div>
                <span className={tx.type === "DEPOSIT" ? "text-success fw-bold" : "text-danger fw-bold"}>
                  {tx.type === "DEPOSIT" ? "+" : "-"}${tx.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
