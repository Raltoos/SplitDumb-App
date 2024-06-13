import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

export default function App(){
  return(
    <div className="min-h-screen w-full bg-green-50 flex flex-col items-center pb-5">
      <Header/>
      <Dashboard/>
    </div>
  );
}
