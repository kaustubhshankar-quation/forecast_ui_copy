
const borderedPageStyle = {
  borderRadius: 0,
  border: "none",
  boxSizing: "border-box",
  width: "100vw",
  minHeight: "100vh",
  margin: 0,
  paddingTop: "40px", // Increased top padding for breadcrumb visibility
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "stretch",
  position: "relative",
  overflow: "auto",
  background: "#f8fafc", // light background, change as needed
};

const keyframes = `
@keyframes shine {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(100%); }
}
`;


export default function BorderedPage({ children, breadcrumb }) {
  return (
    <div style={borderedPageStyle}>
      {breadcrumb && (
        <div style={{ marginBottom: "16px" }}>
          {breadcrumb}
        </div>
      )}
      {children}
    </div>
  );
}