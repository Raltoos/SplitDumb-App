/* eslint-disable react/prop-types */
import Button from "./Button";
import { useState, useRef, useEffect, useContext } from "react";
import PaidBy from "./PaidBy";

import { PeopleContext } from "../store/people-context";
import { TransactionContext } from "../store/transaction-context";

export default function AddExpenseModal({ handleClose }) {
  const { peopleData, setPeople } = useContext(PeopleContext);
  const { setTransactions } = useContext(TransactionContext);

  const [addInfo, setAddInfo] = useState({ show: false, component: null });
  const [validationError, setValidationError] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [descValue, setDesc] = useState("");
  const [suggestions, setSuggestions] = useState(["Add a new friend +"]);
  const [splitData, setSplitData] = useState([
    { name: "You", amount: 0 },
    false,
    [],
  ]);

  const peopleNameList = useRef(["You"]);
  const money = useRef();

  const inputPeople = useRef();

  useEffect(() => {
    if (inputValue.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = peopleData
      .filter(
        (person) =>
          !person.user &&
          person.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((person) => person.name);

    filteredSuggestions.push("Add a new friend +");
    setSuggestions(filteredSuggestions);
  }, [inputValue, peopleData]);

  function splitEvenly(amt, no) {
    return (amt / no).toFixed(2);
  }

  function handleAdd() {
    const payer = splitData[0].name;
    const amt = parseFloat(splitData[0].amount);
    let obj = {owe: false, amt: 0, peopleInvolved: [], paid: 0, description: ""}

    if (peopleNameList.current.length === 0 || isNaN(amt) || amt <= 0) {
      setValidationError("Please enter valid names and amount.");
      return;
    }

    obj.description = {descValue};

    const update = splitEvenly(amt, peopleNameList.current.length);
    if (splitData[1] == true) {
      const moneyPaidByMe = splitData[2].filter(
        (list) => list[0] === "You"
      )[0][1];

      obj.paid = +moneyPaidByMe;
      setPeople((prev) => {
        let newPeople = [...prev];
        const index = newPeople.findIndex(
          (person) => person.name.toLowerCase() === "you"
        );
        if (index !== -1) {
          newPeople[index] = {
            ...newPeople[index],
            spent: (+newPeople[index].spent + +moneyPaidByMe).toFixed(2),
            balance: (+newPeople[index].balance - +moneyPaidByMe).toFixed(2),
          };
        }
        return newPeople;
      });
      if (+update > +moneyPaidByMe) {
        //paid my share or less

        obj.owe = true;
        let list = []
        splitData[2].forEach(element => {
          list.push(element[0])
        });
        obj.peopleInvolved = list;

        let diff = (+update - +moneyPaidByMe).toFixed(2);
        obj.amt = +diff;
        const extraPayers = splitData[2].filter((list) => +list[1] > +update);
        const sortElements = (a, b) =>
          +a[1] > +b[1] ? -1 : +a[1] < +b[1] ? +1 : 0;
        extraPayers.sort(sortElements);

        extraPayers.forEach((payer) => {
          if (+diff >= 0) {
            const toPay = Math.min(diff, +payer[1]);
            diff -= toPay;
            setPeople((prev) => {
              let newPeople = [...prev];
              const index = newPeople.findIndex(
                (person) => person.name.toLowerCase() === "you"
              );
              if (index !== -1) {
                newPeople[index] = {
                  ...newPeople[index],
                  owes: +newPeople[index].owes + +toPay.toFixed(2),
                  balance: +newPeople[index].balance - +toPay.toFixed(2),
                };
              }
              return newPeople;
            });
            setPeople((prev) => {
              let newPeople = [...prev];
              const index = newPeople.findIndex(
                (person) => person.name.toLowerCase() === payer[0].toLowerCase()
              );
              if (index !== -1) {
                newPeople[index] = {
                  ...newPeople[index],
                  owed: +newPeople[index].owed + +toPay.toFixed(2),
                };
              }
              return newPeople;
            });
          }
        });
      } else {
        //paid extra
        obj.owe = false;
        let list = []
        splitData[2].forEach(element => {
          list.push(element[0])
        });
        obj.peopleInvolved = list;

        let diff = (+moneyPaidByMe - +update).toFixed(2);
        obj.amt = +diff;
        const extraPayers = splitData[2].filter((list) => +list[1] < +update);
        const sortElements = (a, b) =>
          +a[1] > +b[1] ? +1 : +a[1] < +b[1] ? -1 : 0;
        extraPayers.sort(sortElements);

        extraPayers.forEach((payer) => {
          if (+diff >= 0) {
            const toPay = Math.min(diff, (+update - +payer[1]));
            diff -= toPay;
            setPeople((prev) => {
              let newPeople = [...prev];
              const index = newPeople.findIndex(
                (person) => person.name.toLowerCase() === "you"
              );
              if (index !== -1) {
                newPeople[index] = {
                  ...newPeople[index],
                  owed: +newPeople[index].owed + +toPay.toFixed(2),
                  balance: +newPeople[index].balance + +toPay.toFixed(2),
                };
              }
              return newPeople;
            });
            setPeople((prev) => {
              let newPeople = [...prev];
              const index = newPeople.findIndex(
                (person) => person.name.toLowerCase() === payer[0].toLowerCase()
              );
              if (index !== -1) {
                newPeople[index] = {
                  ...newPeople[index],
                  owes: +newPeople[index].owes + +toPay.toFixed(2),
                };
              }
              return newPeople;
            });
          }
        });
      }
    } else {
      setPeople((prev) => {
        let newPeople = [...prev];
        if (payer === "You") {
          obj.owe = false;
          obj.paid = +amt;
          obj.amt = +(amt - update).toFixed(2);
          const youIndex = newPeople.findIndex(
            (person) => person.name.toLowerCase() === payer.toLowerCase()
          );
          if (youIndex !== -1) {
            newPeople[youIndex] = {
              ...newPeople[youIndex],
              owed: +newPeople[youIndex].owed + +(amt - update).toFixed(2),
              spent: (+newPeople[youIndex].owed + +update).toFixed(2),
              balance:
                +newPeople[youIndex].balance + +(amt - update).toFixed(2),
            };
          }
          obj.peopleInvolved = [];
          peopleNameList.current.forEach((item) => {
            if (item.toLowerCase() !== payer.toLowerCase()) {
              obj.peopleInvolved.push(item);
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
          obj.owe = true;
          obj.paid = 0;
          obj.amt = +update;
          obj.peopleInvolved = [];
          obj.peopleInvolved.push(payer);
          const payerIndex = newPeople.findIndex(
            (person) => person.name.toLowerCase() === payer.toLowerCase()
          );
          if (payerIndex !== -1) {
            newPeople[payerIndex] = {
              ...newPeople[payerIndex],
              owed: +newPeople[payerIndex].owed + +update,
              balance: +newPeople[payerIndex].balance + amt.toFixed(2),
            };
          }
          const youIndex = newPeople.findIndex(
            (person) => person.name.toLowerCase() === "you"
          );
          if (youIndex !== -1) {
            newPeople[youIndex] = {
              ...newPeople[youIndex],
              owes: +newPeople[youIndex].owes + +update,
              spent: (+newPeople[youIndex].owed + +update).toFixed(2),
              balance: +newPeople[youIndex].balance - +update,
            };
          }
        }
        
        console.log(obj);
        setTransactions((prevTransactions) => [...prevTransactions, obj]);
        return newPeople;
      });
    }

    setValidationError("");
    handleClose([false, ""]);
  }

  function handleAdditional() {
    const amt = splitData[0].amount;
    if (peopleNameList.current.length === 0 || isNaN(amt) || amt <= 0) {
      setValidationError("Please enter valid names and amount.");
      return;
    }
    setAddInfo({
      show: true,
      component: (
        <PaidBy
          amt={amt}
          close={setAddInfo}
          peopleList={peopleNameList.current}
          setSplitData={setSplitData}
        />
      ),
    });
  }

  function handleInputChange(e) {
    setInputValue(e.target.value);
  }

  function handleSuggestionClick(suggestion) {
    let addText;
    if (suggestion === "Add a new friend +") {
      peopleNameList.current.push(
        inputValue.charAt(0).toUpperCase() + inputValue.slice(1)
      );
      addText =
        "<" + inputValue.charAt(0).toUpperCase() + inputValue.slice(1) + ">";
    } else {
      peopleNameList.current.push(suggestion);
      addText = "<" + suggestion + ">";
    }
    inputPeople.current.innerText += addText;
    setInputValue("");
    setSuggestions(["Add a new friend +"]);
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
        <div className="w-full flex justify-between items-center">
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

        <div className="w-full flex items-center justify-between p-4 relative">
          <p className="w-1/2" ref={inputPeople}>
            With <b>you</b> and : &nbsp;
          </p>
          <div className="w-1/2 relative ">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full bg-white border border-black p-1"
              placeholder="Enter names"
            />
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 z-10 max-h-40 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
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

        <div className="p-2">
          <p>
            Paid by{" "}
            <button className="text-green-500" onClick={handleAdditional}>
              {splitData[2].length > 1 ? "Multiple People" : splitData[0].name}
            </button>{" "}
            and split <button className="text-green-500">equally</button>
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

      {addInfo.show && addInfo.component}
    </dialog>
  );
}
