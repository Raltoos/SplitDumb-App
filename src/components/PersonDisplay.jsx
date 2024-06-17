/* eslint-disable react/prop-types */
import Button from "./Button";

export default function PersonDisplay({ data, handleDelete, handleSettle }) {
  let style = "text-sm ";

  let owesStyle = style;
  if (data.owes > 0) owesStyle += "text-green-600";

  let owedStyle = style;
  if (data.owed > 0) owedStyle += "text-red-500";

  return (
    <div className="w-11/12 md:w-7/12 flex flex-col justify-between border border-black rounded-lg p-4 active:scale-105 hover:scale-105 transition-all">
      <div className="flex justify-between">
        <p className="text-2xl">{data.name}</p>

        <div>
          <p className={owesStyle}>Owes : Rs.{data.owes}</p>
          <p className={owedStyle}>Owed : Rs.{data.owed}</p>
        </div>
      </div>
      <div className="flex justify-between">
        <Button addStyle="bg-blue-400 text-sm w-fit h-6 text-center flex flex-col justify-center items-center mt-2"
        onClick={() => handleSettle(data.name)}
        >
          Settle Up!
        </Button>
        <Button
          addStyle="bg-red-400 text-sm w-16 h-6 text-center flex flex-col justify-center items-center mt-2"
          onClick={() => handleDelete(data.name)}
        >
          DELETE
        </Button>
      </div>
    </div>
  );
}
