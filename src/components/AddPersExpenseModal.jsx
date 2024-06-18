/* eslint-disable react/prop-types */
import Button from "./Button";
import { useState, useRef, useContext } from "react";

import { PeopleContext } from "../store/people-context";
import { TransactionContext } from "../store/transaction-context";

export default function AddExpenseModal({ handleClose }) {
  const { setPeople } = useContext(PeopleContext);
  const { setTransactions } = useContext(TransactionContext);

  const [validationError, setValidationError] = useState("");
  const [descValue, setDesc] = useState("");
  const [splitData, setSplitData] = useState([
    { name: "You", amount: 0 },
    false,
    [],
  ]);

  const money = useRef();

  function handleAdd() {
    const amt = parseFloat(splitData[0].amount);
    let obj = {owe: -1, amt: 0, peopleInvolved: [], paid: 0, description: ""}

    if (isNaN(amt) || amt <= 0) {
      setValidationError("Please enter a valid amount.");
      return;
    }
    obj.amt = +amt;
    obj.description = {descValue};
    setPeople((prev) => {
      let newPeople = [...prev];
      const index = newPeople.findIndex(
        (person) => person.name.toLowerCase() === "you"
      );
      if (index !== -1) {
        newPeople[index] = {
          ...newPeople[index],
          spent: +newPeople[index].spent + +amt.toFixed(2),
          balance: +newPeople[index].balance - +amt.toFixed(2),
        };
      }
      return newPeople;
    });

    setTransactions((prevTransactions) => [...prevTransactions, obj]);
    setValidationError("");
    handleClose([false, ""]);
  }

  function handleSingleAmountChange(e) {
    setSplitData((prev) => {
      let newPrev = [...prev];

      newPrev[0].amount = e.target.value;
      return newPrev;
    });
  }

  function handleDescValueChange(e){
    setDesc(e.target.value);
  }

  return (
    <dialog
      open
      className="h-fit w-10/12 sm:w-1/3 bg-transparent opacity-100 flex flex-col gap-5 items-center z-10 font-mono overflow-y-scroll no-scrollbar "
    >
      <div className="opacity-100 w-full bg-white border border-black rounded-xl">
        <div className="w-full flex justify-between items-center mb-5">
          <div className="ml-5">
            {validationError ? (
              <p className=" text-red-500 font-mono">{validationError}</p>
            ) : (
              <p className="bg-green-200 text-md font-bold capitalize border border-black px-10 py-1 mt-2">
                Details of the expense
              </p>
            )}
          </div>
          <Button
            type="button"
            onClick={() => handleClose([false, ""])}
            addStyle="w-fit h-fit border-none shadow-none text-2xl hover:shadow-sm"
          >
            ⨯
          </Button>
        </div>

        <div className="w-full flex flex-col gap-4 items-center ">
          <input
            type="text"
            value={descValue}
            onChange={handleDescValueChange}
            placeholder="Enter a description"
            className="w-11/12 p-2 border border-black rounded-md h-8"
          />
          <p>
            Rs:{" "}
            <input
              ref={money}
              type="number"
              className="border border-black w-20 p-1 rounded-sm"
              onChange={handleSingleAmountChange}
              placeholder="Amount"
            />
          </p>
        </div>

        <form
          method="dialog"
          className="w-full h-full flex justify-center items-end mb-2 mt-3"
        >
          <Button type="button" onClick={handleAdd} addStyle="w-1/3">
            Add Expense
          </Button>
        </form>
      </div>

    </dialog>
  );
}
