/* eslint-disable react/prop-types */
import { useContext, useRef } from "react";
import { TransactionContext } from "../store/transaction-context";

import OwedTransactionDisplay from "./OwedTransactionDisplay";
import OweTransactionDisplay from "./OweTransactionDisplay";
import PersonalExpenseDisplay from "./PersonalExpenseDisplay";

export default function AllExpenses() {
  const { transactions } = useContext(TransactionContext);
  const count = useRef(0);

  return (
    <div className="w-11/12 h-full opacity-100 mb-16 no-scrollbar overflow-y-scroll ">
      <div className="mt-3 w-full h-20 flex justify-center items-center bg-green-100 rounded-lg shadow-lg">
        <p className="text-2xl">All Expense Activities</p>
      </div>
      {transactions.map((transaction, index) => {
        const { amt, peopleInvolved, paid, owe, description } = transaction;
        if (owe === true) {
          count.current = count.current + 1;
          return (
            <OweTransactionDisplay
              id={count.current}
              key={index}
              amt={amt}
              people={peopleInvolved}
              description={description.descValue}
            />
          );
        } else if (owe === -1) {
          count.current = count.current + 1;
          return <PersonalExpenseDisplay id={count.current} key={index} amt={amt} description={description.descValue} />;
        } else {
          count.current = count.current + 1;
          return (
            <OwedTransactionDisplay
              id={count.current}
              key={index}
              owed={amt}
              people={peopleInvolved}
              amtPaid={paid}
              description={description.descValue}
            />
          );
        }
      })}
    </div>
  );
}
