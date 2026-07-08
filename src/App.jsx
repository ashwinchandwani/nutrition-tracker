import { useEffect, useMemo, useState } from "react";

function App() {
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(today);

  const [profile, setProfile] = useState(function () {
    const saved = localStorage.getItem("nutritionProfileV2");
    if (saved) {
      return JSON.parse(saved);
    }

    return {
      name: "Ashwin",
      proteinGoal: 150,
      calorieGoal: 2200,
      weight: ""
    };
  });

  const [meals, setMeals] = useState(function () {
    const saved = localStorage.getItem("nutritionMealsV2");
    if (saved) {
      return JSON.parse(saved);
    }

    return [];
  });

  const [form, setForm] = useState({
    mealType: "Breakfast",
    foodName: "",
    quantity: "",
    protein: "",
    carbs: "",
    fat: "",
    calories: "",
    notes: ""
  });

  const [photo, setPhoto] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      from: "Coach",
      text: "Log your meals and I will give basic personalized guidance based on your protein and calorie goals."
    }
  ]);

  useEffect(function () {
    localStorage.setItem("nutritionProfileV2", JSON.stringify(profile));
  }, [profile]);

  useEffect(function () {
    localStorage.setItem("nutritionMealsV2", JSON.stringify(meals));
  }, [meals]);

  const mealsForDate = useMemo(
    function () {
      return meals.filter(function (meal) {
        return meal.date === date;
      });
    },
    [meals, date]
  );

  const totals = useMemo(
    function () {
      return mealsForDate.reduce(
        function (sum, meal) {
          return {
            protein: sum.protein + Number(meal.protein),
            carbs: sum.carbs + Number(meal.carbs),
            fat: sum.fat + Number(meal.fat),
            calories: sum.calories + Number(meal.calories)
          };
        },
        {
          protein: 0,
          carbs: 0,
          fat: 0,
          calories: 0
        }
      );
    },
    [mealsForDate]
  );

  function handlePhotoUpload(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = function () {
      setPhoto(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function calculateCalories() {
    if (form.calories !== "") {
      return Number(form.calories);
    }

    const proteinCalories = Number(form.protein || 0) * 4;
    const carbCalories = Number(form.carbs || 0) * 4;
    const fatCalories = Number(form.fat || 0) * 9;

    return proteinCalories + carbCalories + fatCalories;
  }

  function addMeal() {
    if (form.foodName.trim() === "") {
      alert("Please enter a food name.");
      return;
    }

    const newMeal = {
      id: Date.now(),
      date: date,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      mealType: form.mealType,
      foodName: form.foodName,
      quantity: form.quantity,
      protein: Number(form.protein || 0),
      carbs: Number(form.carbs || 0),
      fat: Number(form.fat || 0),
      calories: Math.round(calculateCalories()),
      notes: form.notes,
      photo: photo
    };

    setMeals([newMeal, ...meals]);

    setForm({
      mealType: "Breakfast",
      foodName: "",
      quantity: "",
      protein: "",
      carbs: "",
      fat: "",
      calories: "",
      notes: ""
    });

    setPhoto("");
  }

  function deleteMeal(id) {
    const updatedMeals = meals.filter(function (meal) {
      return meal.id !== id;
    });

    setMeals(updatedMeals);
  }

  function askCoach() {
    const proteinGoal = Number(profile.proteinGoal || 0);
    const calorieGoal = Number(profile.calorieGoal || 0);

    const proteinRemaining = Math.max(proteinGoal - totals.protein, 0);
    const caloriesRemaining = Math.max(calorieGoal - totals.calories, 0);

    let reply = "";

    if (totals.protein < proteinGoal) {
      reply = reply + "You still need about " + proteinRemaining.toFixed(0) + "g of protein today. ";
    } else {
      reply = reply + "You already met your protein goal today. ";
    }

    if (totals.calories < calorieGoal) {
      reply = reply + "You have about " + caloriesRemaining.toFixed(0) + " calories left. ";
    } else {
      reply = reply + "You are at or above your calorie goal, so keep the next meal lighter. ";
    }

    if (mealsForDate.length === 0) {
      reply = reply + "Log at least one meal so I can give better suggestions.";
    } else {
      reply = reply + "For your next meal, prioritize lean protein. Adjust carbs based on hunger, workout timing, and your remaining calories.";
    }

    const newMessages = [
      ...chatMessages,
      {
        from: "You",
        text: chatInput || "What should I eat next?"
      },
      {
        from: "Coach",
        text: reply
      }
    ];

    setChatMessages(newMessages);
    setChatInput("");
  }

  const cardStyle = {
    backgroundColor: "white",
    padding: "18px",
    borderRadius: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: "16px"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #cccccc",
    boxSizing: "border-box"
  };

  const buttonStyle = {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: "24px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1>Ashwin's Nutrition Tracker V2</h1>
        <p>Track meals, macros, photos, goals, and basic nutrition guidance.</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px"
          }}
        >
          <div style={cardStyle}>
            <p>Calories</p>
            <h2>{totals.calories} / {profile.calorieGoal}</h2>
          </div>

          <div style={cardStyle}>
            <p>Protein</p>
            <h2>{totals.protein.toFixed(1)}g / {profile.proteinGoal}g</h2>
          </div>

          <div style={cardStyle}>
            <p>Carbs</p>
            <h2>{totals.carbs.toFixed(1)}g</h2>
          </div>

          <div style={cardStyle}>
            <p>Fat</p>
            <h2>{totals.fat.toFixed(1)}g</h2>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "18px"
          }}
        >
          <div style={cardStyle}>
            <h2>Add Meal</h2>

            <label>Date</label>
            <input
              style={inputStyle}
              type="date"
              value={date}
              onChange={function (event) {
                setDate(event.target.value);
              }}
            />

            <label>Meal Type</label>
            <select
              style={inputStyle}
              value={form.mealType}
              onChange={function (event) {
                setForm({ ...form, mealType: event.target.value });
              }}
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>

            <label>Food Name</label>
            <input
              style={inputStyle}
              value={form.foodName}
              placeholder="Example: chicken rice bowl"
              onChange={function (event) {
                setForm({ ...form, foodName: event.target.value });
              }}
            />

            <label>Quantity</label>
            <input
              style={inputStyle}
              value={form.quantity}
              placeholder="Example: 1 bowl, 250g, 2 eggs"
              onChange={function (event) {
                setForm({ ...form, quantity: event.target.value });
              }}
            />

            <label>Protein (g)</label>
            <input
              style={inputStyle}
              type="number"
              value={form.protein}
              onChange={function (event) {
                setForm({ ...form, protein: event.target.value });
              }}
            />

            <label>Carbs (g)</label>
            <input
              style={inputStyle}
              type="number"
              value={form.carbs}
              onChange={function (event) {
                setForm({ ...form, carbs: event.target.value });
              }}
            />

            <label>Fat (g)</label>
            <input
              style={inputStyle}
              type="number"
              value={form.fat}
              onChange={function (event) {
                setForm({ ...form, fat: event.target.value });
              }}
            />

            <label>Calories</label>
            <input
              style={inputStyle}
              type="number"
              value={form.calories}
              placeholder="Optional. App can calculate from macros."
              onChange={function (event) {
                setForm({ ...form, calories: event.target.value });
              }}
            />

            <label>Meal Photo</label>
            <input
              style={inputStyle}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
            

            {photo && (
              <img
                src={photo}
                alt="Meal Preview"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "12px"
                }}
              />
            )}

            <label>Notes</label>
            <textarea
              style={inputStyle}
              value={form.notes}
              placeholder="Example: post-workout, homemade, restaurant"
              onChange={function (event) {
                setForm({ ...form, notes: event.target.value });
              }}
            />

            <button style={buttonStyle} onClick={addMeal}>
              Add Meal
            </button>
          </div>

          <div style={cardStyle}>
            <h2>Profile & Goals</h2>

            <label>Name</label>
            <input
              style={inputStyle}
              value={profile.name}
              onChange={function (event) {
                setProfile({ ...profile, name: event.target.value });
              }}
            />

            <label>Protein Goal (g/day)</label>
            <input
              style={inputStyle}
              type="number"
              value={profile.proteinGoal}
              onChange={function (event) {
                setProfile({ ...profile, proteinGoal: event.target.value });
              }}
            />

            <label>Calorie Goal</label>
            <input
              style={inputStyle}
              type="number"
              value={profile.calorieGoal}
              onChange={function (event) {
                setProfile({ ...profile, calorieGoal: event.target.value });
              }}
            />

            <label>Current Weight</label>
            <input
              style={inputStyle}
              value={profile.weight}
              placeholder="Example: 180 lb"
              onChange={function (event) {
                setProfile({ ...profile, weight: event.target.value });
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "18px"
          }}
        >
          <div style={cardStyle}>
            <h2>Meals for {date}</h2>

            {mealsForDate.length === 0 && <p>No meals logged yet.</p>}

            {mealsForDate.map(function (meal) {
              return (
                <div
                  key={meal.id}
                  style={{
                    border: "1px solid #dddddd",
                    borderRadius: "12px",
                    padding: "12px",
                    marginBottom: "12px"
                  }}
                >
                  <h3>{meal.mealType}: {meal.foodName}</h3>
                  <p>{meal.quantity} | {meal.time}</p>
                  <p>
                    Protein: {meal.protein}g | Carbs: {meal.carbs}g | Fat: {meal.fat}g | Calories: {meal.calories}
                  </p>

                  {meal.notes && <p>Notes: {meal.notes}</p>}

                  {meal.photo && (
                    <img
                      src={meal.photo}
                      alt="Meal"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "10px"
                      }}
                    />
                  )}

                  <br />

                  <button
                    style={{
                      marginTop: "10px",
                      backgroundColor: "#dc2626",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 10px",
                      cursor: "pointer"
                    }}
                    onClick={function () {
                      deleteMeal(meal.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>

          <div style={cardStyle}>
            <h2>Nutrition Coach</h2>

            <div
              style={{
                height: "260px",
                overflowY: "auto",
                backgroundColor: "#f9fafb",
                border: "1px solid #dddddd",
                borderRadius: "12px",
                padding: "12px",
                marginBottom: "12px"
              }}
            >
              {chatMessages.map(function (message, index) {
                return (
                  <div key={index} style={{ marginBottom: "12px" }}>
                    <strong>{message.from}:</strong>
                    <p>{message.text}</p>
                  </div>
                );
              })}
            </div>

            <textarea
              style={inputStyle}
              value={chatInput}
              placeholder="Ask: What should I eat next?"
              onChange={function (event) {
                setChatInput(event.target.value);
              }}
            />

            <button style={buttonStyle} onClick={askCoach}>
              Ask Coach
            </button>

            <p style={{ fontSize: "12px", color: "#666666" }}>
              This is basic guidance only. Real AI photo nutrition estimation will require a backend later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;