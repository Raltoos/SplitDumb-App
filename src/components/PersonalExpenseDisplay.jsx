/* eslint-disable react/prop-types */
export default function PersonalExpenseDisplay({id, amt, description}) {
  return (
    <div className="w-full flex flex-col items-center mt-4 gap-2 border border-black">
      <div className="w-full flex justify-between">
        <div className="w-1/12 text-4xl p-5 flex justify-center items-center">
          {id}
        </div>
        <div className="w-11/12 justify-self-end flex flex-col p-3">
          <p>
            You spent Rs {amt} for the transaction &quot;{description}&quot;.
          </p>
        </div>
      </div>
    </div>
  );
}
