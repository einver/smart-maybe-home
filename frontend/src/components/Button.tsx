type Props = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({ children, onClick }: Props) {
  return (
    <button onClick={onClick} style={btn}>
      {children}
    </button>
  );
}

const btn = {
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  marginRight: "8px"
};

