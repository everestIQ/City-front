export default function Modal({ title, children, onClose }) {
  return (
    <div style={overlay}>
      <div style={content}>
        <h3>{title}</h3>
        {children}
        <div style={{ marginTop: "15px", textAlign: "right" }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "srgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const content = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "400px",
};
