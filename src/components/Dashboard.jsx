/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Button from "./Button";
import AddExpenseModal from "./AddExpenseModal";
import { useState, useRef } from "react";
import { data } from "../assets/UserData";

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
  const [people, setPeople] = useState(data);
  const [click, setClick] = useState([false, ""]);

  function handleAddExpense() {
    setClick([
      true,
      <AddExpenseModal key={1} handleClose={setClick} updatePeople={setPeople} peopleInfo={people}/>,
    ]);
  }

  function handleDelete(toDelName){
    setPeople(prev=>{
      let newPeople = [];
      prev.map(person => {
        if(person.name.toLowerCase() !== toDelName.toLowerCase()){
          newPeople.push(person);
        } 
        return true;
      })

      return newPeople;
    })
  }

  function handleSelfDisplay(){
    const self = people.find((obj)=>obj.user)

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
    <div className="w-11/12 h-full opacity-100">
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
          {people.map((obj) => (
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

function PersonDisplay({ data, handleDelete }) {
  let style = "text-sm ";

  let owesStyle = style;
  if(data.owes > 0) owesStyle += "text-green-600";

  let owedStyle = style;
  if(data.owed > 0) owedStyle += "text-red-500";

  return (
    <div className="w-11/12 md:w-7/12 flex justify-between border border-black rounded-lg p-4 active:scale-105 hover:scale-105 transition-all">
      <div>
        <p className="text-lg">{data.name}</p>
        <p className="text-sm">Balance : Rs.{data.balance}</p>
      </div>
      <div>
        <p className={owesStyle}>Owes : Rs.{data.owes}</p>
        <p className={owedStyle}>Owed : Rs.{data.owed}</p>

        <Button addStyle="bg-red-400 text-sm w-16 h-6 text-center flex flex-col justify-center items-center mt-2" onClick={() => handleDelete(data.name)}>DELETE</Button>
      </div>
    </div>
  );
}
