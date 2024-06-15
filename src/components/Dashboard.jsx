/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import '../index.css'

import Button from "./Button";
import AddExpenseModal from "./AddExpenseModal";
import PersonDisplay from "./PersonDisplay";

import { PeopleContext } from '../store/people-context';
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
  const {peopleData, setPeople} = useContext(PeopleContext)
  const [click, setClick] = useState([false, ""]);

  function handleAddExpense() {
    setClick([
      true,
      <AddExpenseModal key={1} handleClose={setClick}/>,
    ]);
  }

  function handleDelete(toDelName){
    const self = peopleData.find((obj)=>obj.user);
    setPeople(prev=>{
      let newPeople = [];
      prev.map(person => {
        if(person.name.toLowerCase() !== toDelName.toLowerCase()){
          newPeople.push(person);
        }//have to implement the functionality to handle the side effect of deleting the user in terms of transactions
        return true;
      })

      return newPeople;
    })
    
  }

  function handleSelfDisplay(){
    const self = peopleData.find((obj)=>obj.user)

    let balStyle;
    if(self.balance > 0) balStyle = "border-r border-black text-green-600";
    else balStyle = "border-r border-black text-red-500";

    let oweStyle;
    if(self.owes > 0) oweStyle = "border-r border-black text-red-500";
    else oweStyle = "border-r border-black";

    let owedStyle;
    if(self.owed > 0) owedStyle = "text-green-600";
    else owedStyle = "";

    return [self.balance, self.owed, self.owes, balStyle, oweStyle, owedStyle];
  }

  let style = "w-full h-full flex flex-col gap-1 items-center ";
  if (click[0]) style += "opacity-40";

  return (
    <div className="w-11/12 h-full opacity-100 mb-16 overflow-y-scroll no-scrollbar">
      {click[0] && click[1]}

      <div className={style}>
        <div className="w-full flex items-center justify-between p-3 md:justify-evenly sm:justify-evenly">
          <h3 className="text-xl justify-self-start sm:text-2xl">Dashboard</h3>
          <div className="w-4/12 flex justify-end gap-4 p-3">
            <Button
              type="button"
              addStyle="bg-orange-400 text-sm sm:text-lg"
              onClick={handleAddExpense}
            >
              Add an expense
            </Button>
            <Button type="button" addStyle="bg-sky-400 text-sm sm:text-lg">
              Settle Up
            </Button>
          </div>
        </div>
        <div className="w-full md:w-9/12 flex justify-between h-16">
          <BalanceDisplay balance={handleSelfDisplay()[0]} addStyle={handleSelfDisplay()[3]}>
            total balance
          </BalanceDisplay>
          <BalanceDisplay balance={handleSelfDisplay()[2]} addStyle={handleSelfDisplay()[4]}>
            you owe
          </BalanceDisplay>
          <BalanceDisplay balance={handleSelfDisplay()[1]} addStyle={handleSelfDisplay()[5]}>you are owed</BalanceDisplay>
        </div>

        <div className="w-full flex flex-col items-center mt-4 gap-2">
          {peopleData.map((obj) => (
            !obj.user?<PersonDisplay key={obj.name} data={obj} handleDelete={handleDelete}/>:null
          ))}
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