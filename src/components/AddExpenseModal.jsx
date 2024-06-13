/* eslint-disable react/prop-types */
import Button from "./Button";
import { useState, useRef, useEffect } from "react";
import PaidBy from "./PaidBy";

export default function AddExpenseModal({
  handleClose,
  updatePeople,
  peopleInfo,
}) {
  const [addInfo, setAddInfo] = useState({ show: false, component: null });
  const [validationError, setValidationError] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState(["Add a new friend +"]);
  const [splitData, setSplitData] = useState([["You"], { name: 0, amount: 0 }]);

  const peopleNameList = useRef(["You"]);
  const money = useRef();

  const inputPeople = useRef();

  useEffect(() => {
    if (inputValue.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = peopleInfo
      .filter(
        (person) =>
          !person.user &&
          person.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((person) => person.name);

    filteredSuggestions.push("Add a new friend +");
    setSuggestions(filteredSuggestions);
  }, [inputValue, peopleInfo]);

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

    updatePeople((prev) => {
      let newPeople = [...prev];
      const foundIndex = newPeople.findIndex(
        (person) => person.name.toLowerCase() === payer.toLowerCase()
      );
      if (foundIndex !== -1) {
        newPeople[foundIndex] = {
          ...newPeople[foundIndex],
          owed: +newPeople[foundIndex].owed + +update,
          balance: +newPeople[foundIndex].balance + +update,
        };
      } else {
        newPeople.push({
          name: payer.charAt(0).toUpperCase() + payer.slice(1),
          owes: 0,
          owed: update,
          balance: update,
        });
      }

      return newPeople;
    });

    updatePeople((prev) => {
      let newPeople = [...prev];

      peopleNameList.current.forEach((item) => {
        if (item.toLowerCase() !== payer.toLowerCase()) {
          const foundIndex = newPeople.findIndex(
            (person) =>
              person.name.toLowerCase() !== payer.toLowerCase() &&
              person.name.toLowerCase() === item.toLowerCase()
          );

          if (foundIndex !== -1) {
            newPeople[foundIndex] = {
              ...newPeople[foundIndex],
              owes: +newPeople[foundIndex].owes + +update,
              balance: +newPeople[foundIndex].balance - +update,
            };
          } else {
            newPeople.push({
              name: item.charAt(0).toUpperCase() + item.slice(1),
              owes: +update,
              owed: 0,
              balance: +update,
            });
          }
        }
      });

      return newPeople;
    });

    setValidationError("");
    handleClose([false, ""]);
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

      newPrev[1].amount = e.target.value;
      return newPrev;
    });
  }

  return (
    <dialog
      open
      className="h-fit w-10/12 sm:w-1/3 bg-transparent opacity-100 flex flex-col gap-5 items-center z-10 font-mono"
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
            <button
              className="text-green-500"
              onClick={() =>
                setAddInfo({
                  show: true,
                  component: (
                    <PaidBy
                      close={setAddInfo}
                      peopleList={peopleNameList.current}
                      setSplitData={setSplitData}
                    />
                  ),
                })
              }
            >
              {splitData[0]}
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
