import { useState } from "react";

function App() {
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);

  const calories = protein * 4 + carbs * 4 + fat * 9;

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial"
      }}
    >
      <h1>💪 Ashwin's Nutrition Tracker</h1>

      <h2>Daily Macros</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Protein (g): </label>
        <input
          type="number"
          value={protein}
          onChange={(e) => setProtein(Number(e.target.value))}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Carbs (g): </label>
        <input
          type="number"
          value={carbs}
          onChange={(e) => setCarbs(Number(e.target.value))}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Fat (g): </label>
        <input
          type="number"
          value={fat}
          onChange={(e) => setFat(Number(e.target.value))}
        />
      </div>

      <hr />

      <h2>Today's Totals</h2>

      <p>Protein: {protein} g</p>
      <p>Carbs: {carbs} g</p>
      <p>Fat: {fat} g</p>

      <h3>Total Calories: {calories}</h3>
    </div>
  );
}

export default App;