/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Button from "./Button";
import { useState, useRef, useContext } from "react";

import { PeopleContext } from "../store/people-context";

export default function AddExpenseModal({ handleClose }) {
  // const { peopleData, setPeople } = useContext(PeopleContext);

  const [validationError, setValidationError] = useState("");
  const [splitData, setSplitData] = useState([
    ["You"],
    { name: "", amount: 0 },
  ]);

  const peopleNameList = useRef(["You"]);
  const money = useRef();

  function splitEvenly(amt, no) {
    return (amt / no).toFixed(2);
  }

  function handleAdd() {
    const payer = splitData[0][0];
    const amt = parseFloat(splitData[1].amount);

    if (peopleNameList.current.length === 0 || isNaN(amt) || amt <= 0) {
      setValidationError("Please enter valid names and amount.");
      return;
    }

    const update = splitEvenly(amt, peopleNameList.current.length);
    console.log(amt-update)
    setPeople((prev) => {
      let newPeople = [...prev];
      if (payer.toLowerCase() === "you") {
        // Update "You" payer logic
        const youIndex = newPeople.findIndex(
          (person) => person.name.toLowerCase() === payer.toLowerCase()
        );
        if (youIndex !== -1) {
          newPeople[youIndex] = {
            ...newPeople[youIndex],
            owed: +newPeople[youIndex].owed + (amt-update),
            balance: +newPeople[youIndex].balance + amt,
          };
        } else {
          newPeople.push({
            name: payer.charAt(0).toUpperCase() + payer.slice(1),
            owes: 0,
            owed: amt,
            balance: amt,
          });
        }

        peopleNameList.current.forEach((item) => {
          if (item.toLowerCase() !== payer.toLowerCase()) {
            const personIndex = newPeople.findIndex(
              (person) => person.name.toLowerCase() === item.toLowerCase()
            );
            if (personIndex !== -1) {
              newPeople[personIndex] = {
                ...newPeople[personIndex],
                owes: +newPeople[personIndex].owes + +update,
                balance: +newPeople[personIndex].balance - +update,
              };
            } else {
              newPeople.push({
                name: item.charAt(0).toUpperCase() + item.slice(1),
                owes: +update,
                owed: 0,
                balance: -update,
              });
            }
          }
        });
      } else {
        // Update other payer logic
        const payerIndex = newPeople.findIndex(
          (person) => person.name.toLowerCase() === payer.toLowerCase()
        );
        if (payerIndex !== -1) {
          newPeople[payerIndex] = {
            ...newPeople[payerIndex],
            owed: +newPeople[payerIndex].owed + +update,
          };
        } else {
          newPeople.push({
            name: payer.charAt(0).toUpperCase() + payer.slice(1),
            owes: 0,
            owed: update,
            balance: update,
          });
        }
      }

      console.log("Updated state:", newPeople);
      return newPeople;
    });

    setValidationError("");
    handleClose([false, ""]);
  }

  function handleSingleAmountChange(e) {
    setSplitData((prev) => {
      let newPrev = [...prev];

      newPrev[1].amount = e.target.value;
      return newPrev;
    });
  }

  return (
    <dialog
      open
      className="h-fit w-10/12 sm:w-1/3 bg-transparent opacity-100 flex flex-col gap-5 items-center z-10 font-mono overflow-y-scroll no-scrollbar "
    >
      <div className="opacity-100 w-full bg-white border border-black rounded-xl">
        <div className="w-full flex justify-between items-center">
          <div className="ml-5">
            {validationError ? (
              <p className=" text-red-500 font-mono">{validationError}</p>
            ) : (
              <p className="text-md font-bold capitalize border border-black px-10 py-1 mt-2">
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

