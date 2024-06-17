/* eslint-disable react/prop-types */
import { useContext, useRef } from "react";
import { TransactionContext } from "../store/transaction-context";

export default function AllExpenses() {
  const { transactions } = useContext(TransactionContext);
  const count = useRef(0);

  return (
    <div className="w-11/12 h-full opacity-100 mb-16 no-scrollbar overflow-y-scroll ">
      <div className="mt-3 w-full h-20 flex justify-center items-center bg-green-100 rounded-lg shadow-lg">
        <p className="text-2xl">All Expense Activities</p>
      </div>

      {console.log(transactions)}
      {transactions.map((transaction, index) => {
        const { amt, peopleInvolved, paid, owe } = transaction;
        if (owe) {
          count.current = count.current + 1;
          return (
            <OweTransactionDisplay
              id={count.current}
              key={index}
              amt={amt}
              people={peopleInvolved}
            />
          );
        } else {
          count.current = count.current + 1;
          return (
            <OwedTransactionDisplay
              id={count.current}
              key={index}
              owed={amt}
              people={peopleInvolved}
              amtPaid={paid}
            />
          );
        }
      })}
    </div>
  );
}

function OwedTransactionDisplay({ id, owed, people, amtPaid }) {
  return (
    <div className="w-full flex flex-col items-center mt-4 gap-2 border border-black">
      <div className="w-full flex justify-between border border-black">
        <div className="w-1/12 text-4xl p-5 flex justify-center items-center">
        {id}
        </div>
        <div className="w-11/12 justify-self-end flex flex-col p-3">
          <p>
            You are owed Rs {owed} for a transaction involving (
            {people.join(", ")})
          </p>
          <p>
            <b className="mr-2">-</b>You paid Rs {amtPaid}
          </p>
        </div>
      </div>
    </div>
  );
}

function OweTransactionDisplay({ id, owe, people }) {
  return (
    <div className="w-full flex flex-col items-center mt-4 gap-2 border border-black">
      <div className="w-full flex justify-between border border-black">
        <div className="w-1/12 text-4xl p-5 flex justify-center items-center">
          {id}
        </div>
        <div className="w-11/12 justify-self-end flex flex-col p-3">
          <p>
            You owe Rs {owe} for a transaction in which {people.join(", ")} paid.
          </p>
        </div>
      </div>
    </div>
  );
}
