/* eslint-disable react/prop-types */
import Button from "./Button";

export default function PersonDisplay({ data, handleDelete }) {
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