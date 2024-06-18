/* eslint-disable react/prop-types */
import { useState } from "react";

export default function OwedTransactionDisplay({
  id,
  owed,
  people,
  amtPaid,
  description,
}) {
  const [click, setClick] = useState(false);
  return (
    <div className="w-full flex flex-col items-center mt-4 gap-2 border border-black">
      <div className="w-full flex justify-between border-b border-black">
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
      <div className="w-full p-2">
        <button onClick={() => setClick(!click)}>
        {click ? <p>⬇️</p> : <p>➡️ Description</p>}
        </button>
        {click && <p>{description}</p>}
      </div>
    </div>
  );
}
