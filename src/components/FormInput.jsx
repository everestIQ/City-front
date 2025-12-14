export default function FormInput({ label, ...props }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label style={{ display: "block", fontWeight: "bold" }}>
        {label}
      </label>
      <input
        {...props}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
        }}
      />
    </div>
  );
}
