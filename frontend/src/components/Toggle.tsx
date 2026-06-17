type Props = {
  checked: boolean;
  onChange: () => void;
};

export default function Toggle({ checked, onChange }: Props) {
  return (
    <div onClick={onChange} style={{
      width: 50,
      height: 26,
      borderRadius: 20,
      background: checked ? "#22c55e" : "#ccc",
      position: "relative",
      cursor: "pointer"
    }}>
      <div style={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: "#fff",
        position: "absolute",
        top: 2,
        left: checked ? 26 : 2,
        transition: "0.2s"
      }} />
    </div>
  );
}