import { useReducer, useState } from "react";

import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import NavBar from "./components/NavBar";
import AllExpenses from "./components/AllExpenses";
import { data } from "./assets/UserData.js";

import { PeopleContext } from "./store/people-context";
import { TransactionContext } from "./store/transaction-context.jsx";

function displayReducer(state, action) {
  if (action.type == "DASHBOARD") {
    return <Dashboard />;
  }
  if (action.type == "ALL-EXPENSES") {
    return <AllExpenses />;
  }
  return state;
}

export default function App() {
  const [people, setPeople] = useState(data);
  const [transactions, setTransactions] = useState([{owe: false, amt: 50, peopleInvolved: ["Harsh", "Krishn"], paid: 150, description: {descValue:"Went to a park and paid for everyone's ticket"}}, {owe: true, amt: 500, peopleInvolved: ["Aadit", "Pranav"], paid: 0, description: {descValue:"I have to pay my share for the movie ticket"}}]);
  const [displayState, displayStateDispatch] = useReducer(
    displayReducer,
    <Dashboard />
  );

  const cntxValue1 = {
    peopleData: people,
    setPeople: setPeople,
  };
  const cntxValue2 = {
    transactions: transactions,
    setTransactions: setTransactions,
  };
  return (
    <PeopleContext.Provider value={cntxValue1}>
      <TransactionContext.Provider value={cntxValue2}>
        <div className="min-h-screen w-full bg-green-50 flex flex-col items-center pb-5 overflow-y-scroll no-scrollbar">
          <Header />
          {displayState}
          <NavBar navClickFunc={displayStateDispatch} />
        </div>
      </TransactionContext.Provider>
    </PeopleContext.Provider>
  );
}
