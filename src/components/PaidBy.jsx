/* eslint-disable react/prop-types */
import Button from "./Button";
import { useState } from "react";

export default function PaidBy({ amt, close, peopleList, setSplitData }) {
  const [isChecked, setIsChecked] = useState(false);
  const [inputValues, setInputValues] = useState(
    peopleList.reduce((acc, person) => {
      acc[person] = 0;
      return acc;
    }, {})
  );
  const [validationError, setValidationError] = useState("");

  function handlePaidByX(e) {
    const name = e.target.innerText;
    setSplitData((prev) => {
      let newPrev = [...prev];
      newPrev[0].name = name;

      newPrev[1] = false;
      return newPrev;
    });
    close({ show: false, component: null });
  }

  function handleInputChange(e, person) {
    const { value } = e.target;
    setInputValues((prev) => ({
      ...prev,
      [person]: value,
    }));
  }

  function handleMultipleAddExpense() {
    let sum = 0;
    const keys = Object.keys(inputValues);

    keys.forEach(key => {
      sum += +inputValues[key];
    });

    if(sum != amt){
      setValidationError("The entered values don't match the total amount!");
      return ;
    }

    setSplitData((prev) => {
      let newSplit = [...prev];

      newSplit[2] = [];
      Object.keys(inputValues).forEach((key) => {
        if (inputValues[key] >= 0) {
          let newList = [0, 0];
          newList[0] = key;
          newList[1] = inputValues[key];
          newSplit[2].push(newList);
        }
      });
      newSplit[1] = true;
      return newSplit;
    });
    close({ show: false, component: null });
  }

  return (
    <div className="w-full border border-black bg-white rounded-xl flex flex-col items-center">
      <div className="w-full flex justify-between items-center">
        <div className="ml-5">
          {validationError ? (
              <p className=" text-red-500 font-mono">{validationError}</p>
            ) : (
          <p className="text-md font-bold capitalize border border-black px-10 py-1 mt-2">
            Paid By
          </p>)}
        </div>
        <Button
          type="button"
          onClick={() => close({ show: false, component: null })}
          addStyle="w-fit h-fit border-none shadow-none text-2xl hover:shadow-sm"
        >
          ⨯
        </Button>
      </div>

      <ul className="w-11/12 flex flex-col justify-center items-start mt-2 ml-2">
        {peopleList.map((people, ind) => (
          <li
            key={ind}
            className="w-full hover:bg-gray-100 cursor-pointer border-b border-b-gray-300"
            onClick={handlePaidByX}
          >
            {people}
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => setIsChecked((prev) => !prev)}
        />
        <p>Multiple People</p>
      </div>
      {isChecked && (
        <ul className="w-fit flex flex-col justify-center items-end mt-2 mr-9">
          {/* <li className="w-fit flex justify-center items-center">You :&nbsp;<span className="text-sm">Rs.</span><input type="number" className="border border-black w-16 ml-1 p-1" defaultValue={0}/></li> */}
          {peopleList.map((people, ind) => (
            <li key={ind} className="w-fit flex justify-center items-center">
              {people} :&nbsp;<span className="text-sm">Rs.</span>
              <input
                type="number"
                className="border border-black w-16 ml-1 p-1"
                value={inputValues[people]}
                onChange={(e) => handleInputChange(e, people)}
              />
            </li>
          ))}
        </ul>
      )}

      <form
        method="dialog"
        className="w-full h-full flex justify-center items-end mb-4 mt-3"
      >
        <Button type="button" addStyle="w-1/3" onClick={handleMultipleAddExpense}>
          Add Expense
        </Button>
      </form>
    </div>
  );
}
