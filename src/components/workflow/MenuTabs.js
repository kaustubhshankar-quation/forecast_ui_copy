import React from "react";

export const MenuTabs = ({ children, tabState, changeHandler }) => {
  let content;
  let buttons = [];

  return (
    <div>
      {React.Children.map(children, (child) => {
        buttons.push({ label: child.props.label, name: child.props.name });
        if (child.props.label === tabState.activeTab)
          content = child.props.children;
      })}

      <ul
        style={{
          display: "flex",
          justifyContent: "flex-start",
          gap: "20px",
          listStyle: "none",
          margin: "0 0 30px 0",
          padding: "0",
        }}
      >
        {buttons.map((button, index) => {
          const isActive = button.label === tabState.activeTab;

          return (
            <li
              key={button.label}
              onClick={() => changeHandler(button.label)}
              style={{
                cursor: "pointer",
                padding: "14px 28px",
                borderRadius: "12px",
                background: isActive
                  ? "linear-gradient(90deg, #1230AE, #0058B0)"
                  : "#EAF5F4",
                color: isActive ? "#fff" : "#043b2d",
                fontWeight: isActive ? "700" : "500",
                fontSize: "1rem",
                letterSpacing: "0.5px",
                border: isActive
                  ? "2px solid rgba(0, 234, 199, 0.6)"
                  : "2px solid transparent",
                boxShadow: isActive
                  ? "0 6px 16px rgba(18,48,174,0.4)"
                  : "0 3px 8px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.boxShadow =
                    "0 6px 14px rgba(18,48,174,0.25)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  e.currentTarget.style.boxShadow =
                    "0 3px 8px rgba(0,0,0,0.08)";
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "24px",
                  height: "24px",
                  backgroundColor: isActive ? "#00EAC7" : "#0058B0",
                  color: isActive ? "#043b2d" : "#fff",
                  borderRadius: "50%",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                }}
              >
                {index + 1}
              </span>
              {button.name}
            </li>
          );
        })}
      </ul>

      <div>{content}</div>
    </div>
  );
};

export const MenuTab = (props) => <>{props.children}</>;
