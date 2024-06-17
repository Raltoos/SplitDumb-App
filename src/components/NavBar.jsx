/* eslint-disable react/prop-types */
export default function NavBar({ navClickFunc }) {
  return (
    <div className="fixed bottom-0 w-full h-20 flex items-center border-t border-black bg-green-50">
      <NavBarOption>
        <button className="size-full" onClick={() => navClickFunc({ type: "ALL-EXPENSES" })}>
          All Expenses
        </button>
      </NavBarOption>
      <NavBarOption>
        <button className="size-full" onClick={() => navClickFunc({ type: "DASHBOARD" })}>
          Dashboard
        </button>
      </NavBarOption>
    </div>
  );
}

function NavBarOption({ children, rBorder = true, selected = false }) {
  const rightBorderStyle = "border-r border-r-black ";
  let style =
    "h-full w-1/2 flex justify-center items-center text-lg hover:bg-green-100 overflow-y-scroll no-scrollbar ";

  if (rBorder) style += rightBorderStyle;
  if (selected) style += "bg-green-100";
  return <div className={style}>{children}</div>;
}
