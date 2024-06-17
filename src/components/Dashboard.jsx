/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import "../index.css";

import Button from "./Button";
import AddExpenseModal from "./AddExpenseModal";
import AddPersExpense from "./AddPersExpenseModal";
import PersonDisplay from "./PersonDisplay";

import { PeopleContext } from "../store/people-context";
import { useState, useContext } from "react";

/* 
    state - [myself, personB, personC]
          - [expense1, expense2]
    personX = {
        balance,
        owed,
        owe
    }
    
    adding an expense : it will involve people, 
                        it will involve splitting,
                        it will involve updating personX object,
                        it will involve creating a new expense object
                        
*/

export default function Dashboard() {
  const { peopleData, setPeople } = useContext(PeopleContext);
  const [click, setClick] = useState([false, ""]);
  const [isChecked, setIsChecked] = useState(false);

  function handleAddExpense() {
    setClick([true, <AddExpenseModal key={1} handleClose={setClick} />]);
  }

  function handlePersExpense() {
    setClick([true, <AddPersExpense key={1} handleClose={setClick} />]);
  }

  function handleDelete(toDelName) {
    setPeople((prev) => {
      let newPeople = [];
      prev.map((person) => {
        if (person.name.toLowerCase() !== toDelName.toLowerCase()) {
          newPeople.push(person);
        } //have to implement the functionality to handle the side effect of deleting the user in terms of transactions
        return true;
      });

      return newPeople;
    });
  }

  function handleSettleUp(toSettleName) {
    const clientIndex = peopleData.findIndex(
      (person) => person.name.toLowerCase() === toSettleName.toLowerCase()
    );

    if (clientIndex === -1) return;

    const client = peopleData[clientIndex];
    const { owed, owes } = client;

    setPeople((prev) => {
      return prev.map((person, index) => {
        if (index === clientIndex) {
          return { ...person, owed: 0, owes: 0 };
        } else if (person.user) {
          return {
            ...person,
            owed: (person.owed - +owes).toFixed(2),
            owes: (person.owes - +owed).toFixed(2),
          };
        }
        return person;
      });
    });
  }

  function handleSelfDisplay() {
    const self = peopleData.find((obj) => obj.user);

    let balStyle;
    if (self.balance > 0) balStyle = "text-green-600";
    else balStyle = "text-red-500";

    let oweStyle;
    if (self.owes > 0) oweStyle = "border-r border-black text-red-500";
    else oweStyle = "border-r border-black";

    let owedStyle;
    if (self.owed > 0) owedStyle = "text-green-600";
    else owedStyle = "";

    return [self.balance, self.owed, self.owes, balStyle, oweStyle, owedStyle, self.spent];
  }

  let style = "w-full h-full flex flex-col gap-1 items-center ";
  if (click[0]) style += "opacity-40";

  return (
    <div className="w-11/12 h-full opacity-100 mb-16 no-scrollbar overflow-y-scroll">
      {click[0] && click[1]}

      <div className={style}>
        <div className="mt-2 bg-green-100 w-full md:w-7/12 rounded-lg flex flex-col self-center border-dotted border-black shadow-lg">
          <div className="w-full flex items-center justify-between p-3 sm:justify-between">
            <h3 className="w-1/2 text-xl justify-self-start sm:text-2xl">
              Dashboard
            </h3>
            <div className="w-6/12 flex justify-end gap-4 p-3">
              <Button
                type="button"
                addStyle="bg-orange-400 text-sm sm:text-md w-fit"
                onClick={handleAddExpense}
              >
                Shared Expense
              </Button>
              <Button
                type="button"
                addStyle="bg-blue-300 text-sm sm:text-md w-fit"
                onClick={handlePersExpense}
              >
                Personal Expense
              </Button>
            </div>
          </div>
          <div className="w-full md:w-6/12 flex justify-center h-28 md:border md:p-2 border-black rounded-md self-center my-2">
            <div className="w-1/3 border-r border-black flex flex-col justify-center items-center">
              <BalanceDisplay
                balance={handleSelfDisplay()[0]}
                addStyle={handleSelfDisplay()[3]}
              >
                total balance
              </BalanceDisplay>
            </div>
            <div className="w-2/3 flex flex-col">
              <div className="border-b border-black">
                <BalanceDisplay balance={handleSelfDisplay()[6]}>you spent</BalanceDisplay>
              </div>
              <div className="flex">
                <BalanceDisplay
                  balance={handleSelfDisplay()[2]}
                  addStyle={handleSelfDisplay()[4]}
                >
                  owe
                </BalanceDisplay>
                <BalanceDisplay
                  balance={handleSelfDisplay()[1]}
                  addStyle={handleSelfDisplay()[5]}
                >
                  owed
                </BalanceDisplay>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center mt-4 gap-2">
          <div className="flex gap-2">
            <input type="checkbox" checked={isChecked} onChange={()=>setIsChecked(prev=>!prev)}/>
            <label>Show items with pending transactions</label>
          </div>
          {peopleData.map((obj) =>
            (isChecked)?((!obj.user && (obj.owes > 0 || obj.owed > 0)) ? (
              <PersonDisplay
                key={obj.name}
                data={obj}
                handleDelete={handleDelete}
                handleSettle={handleSettleUp}
              />
            ) : null) : (!obj.user)? (
              <PersonDisplay
                key={obj.name}
                data={obj}
                handleDelete={handleDelete}
                handleSettle={handleSettleUp}
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

function BalanceDisplay({ addStyle = "", balance = "0", children }) {
  let style = "w-full flex flex-col justify-center items-center gap-1 ";
  style += addStyle;
  return (
    <div className={style}>
      {children}
      <p className="text-sm">Rs. {balance}</p>
    </div>
  );
}
