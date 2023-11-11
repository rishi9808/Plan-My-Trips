import { useState } from "react";
import ReactLoading from "react-loading";

import "./App.css";

function App() {
  const [dayCount, setDayCount] = useState([]);
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [travelPlan, setTravelPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    //validate the form
    if (!destination || !budget || !dayCount) {
      alert("Please enter all the fields ");
      setLoading(false);
      return;
    }

    //construct the prompt
    const prompt = `I need a complete travel plan with places or attractions to visit and food to try in for ${dayCount} Days in ${destination} in  a budget of Rs${budget}.show the output day by day in paragraph format in precise on point.
    the output should contain only the table and the budget breakdown.No other text should be added to the output. the output should include \n to repesent new line  and \t to represent tab.
    output format: Day 1  details 
    Day 2 details.. and so on`;

    // construct the reques option
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + import.meta.env.VITE_OPENAI_API,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-instruct",
        prompt: prompt,
        max_tokens: 2000,
        temperature: 0,
      }),
    };
    try {
      const response = await fetch(
        "https://api.openai.com/v1/completions",
        requestOptions
      );
      const data = await response.json();

      setTravelPlan(data.choices[0].text);

      var travel_plan = data.choices[0].text;
      var travel_plan_array = travel_plan.split("\n");

      setTravelPlan(travel_plan_array);
    } catch (error) {
      console.log(error);
      alert(error);
      setLoading(false)
    }
  };
  return (
    <>
      {!travelPlan ? (<h1 className="font-Rampart text-3xl">Plan My Trip </h1>) : (<h1 className="font-Rampart text-3xl">Generated Travel Plan</h1>)}
      {!travelPlan && (
        <form onSubmit={handleFormSubmit} className=" m-10">
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="shadow appearance-none border rounded m-3 p-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your destination..."
          />

          <br />

          <input
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="block shadow appearance-none border rounded m-3 p-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your budget"
          />
          <input
            type="text"
            value={dayCount}
            onChange={(e) => setDayCount(e.target.value)}
            className="shadow appearance-none border rounded m-3 p-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter number of days"
          />

          <br />
          {!loading ? (
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded focus:outline-none focus:shadow-outline"
              onClick={() => setLoading(true)}
            >
              Generate Travel Plan
            </button>
          ) : (
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded focus:outline-none focus:shadow-outline"
            >
           
              <ReactLoading type="spinningBubbles" color="#fffff"
                height={25} width={30}  />
            </button>
          )}
        </form>
      )}
      {travelPlan && (
        <div className=" border rounded-lg shadow-lg p-2 m-2">
          
          <div>
            {travelPlan.map((item, index) =>
              item.includes("Day") || item.includes("Budget breakdown") ? (
                <h3 className="block font-bold mb-2 text-sky-700 text-2xl text-center underline p-2 " key={index}>
                  {item}
                </h3>
              ) : (
                <p className="block font-bold mb-2  text-cyan-950" key={index}>
                  {item}
                </p>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
