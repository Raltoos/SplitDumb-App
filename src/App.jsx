import { useReducer, useState } from "react";

import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import NavBar from "./components/NavBar";
import AllExpenses from "./components/AllExpenses";
import { data } from "./assets/UserData.js";

import { PeopleContext } from "./store/people-context";

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
  const [displayState, displayStateDispatch] = useReducer(
    displayReducer,
    <Dashboard />
  );

  const cntxValue = {
    peopleData: people,
    setPeople: setPeople,
  };
  return (
    <PeopleContext.Provider
      className="min-h-screen w-full bg-green-50 flex flex-col items-center pb-5"
      value={cntxValue}
    >
      <Header />
      {displayState}
      <NavBar navClickFunc={displayStateDispatch} />
    </PeopleContext.Provider>
  );
}
