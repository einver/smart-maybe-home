type Props = {
  children: React.ReactNode;
};

export default function Card({ children }: Props) {
  return (
    <div style={card}>
      {children}
    </div>
  );
}


const card = {
  background: "#fff",
  borderRadius: "14px",
  padding: "16px",
  marginBottom: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  // transition: "box-shadow 0.3s ease"
};