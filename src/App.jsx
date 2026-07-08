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

  const quickFoods = [
  {
    emoji: "🍗",
    name: "Chicken Breast",
    servingSize: 100,
    unit: "g",
    protein: 31,
    carbs: 0,
    fat: 3.6,
    calories: 165,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    calcium: 15,
    iron: 1,
    potassium: 256
  },
  {
    emoji: "🥚",
    name: "Egg",
    servingSize: 1,
    unit: "egg",
    protein: 6,
    carbs: 0.6,
    fat: 5,
    calories: 72,
    fiber: 0,
    sugar: 0.4,
    sodium: 71,
    calcium: 28,
    iron: 0.9,
    potassium: 69
  },
  {
    emoji: "🥣",
    name: "Greek Yogurt",
    servingSize: 100,
    unit: "g",
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    calories: 59,
    fiber: 0,
    sugar: 3.2,
    sodium: 36,
    calcium: 110,
    iron: 0,
    potassium: 141
  },
  {
    emoji: "🥛",
    name: "Protein Shake",
    servingSize: 1,
    unit: "scoop",
    protein: 25,
    carbs: 3,
    fat: 2,
    calories: 130,
    fiber: 1,
    sugar: 1,
    sodium: 160,
    calcium: 120,
    iron: 1,
    potassium: 180
  },
  {
    emoji: "🍚",
    name: "Rice",
    servingSize: 100,
    unit: "g",
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    calories: 130,
    fiber: 0.4,
    sugar: 0.1,
    sodium: 1,
    calcium: 10,
    iron: 0.2,
    potassium: 35
  },
  {
    emoji: "🍌",
    name: "Banana",
    servingSize: 1,
    unit: "medium",
    protein: 1.3,
    carbs: 27,
    fat: 0.3,
    calories: 105,
    fiber: 3.1,
    sugar: 14.4,
    sodium: 1,
    calcium: 6,
    iron: 0.3,
    potassium: 422
  },
  {
    emoji: "🐟",
    name: "Salmon",
    servingSize: 100,
    unit: "g",
    protein: 22,
    carbs: 0,
    fat: 12,
    calories: 208,
    fiber: 0,
    sugar: 0,
    sodium: 59,
    calcium: 9,
    iron: 0.3,
    potassium: 363
  },
  {
    emoji: "🥔",
    name: "Potato",
    servingSize: 100,
    unit: "g",
    protein: 2,
    carbs: 17,
    fat: 0.1,
    calories: 77,
    fiber: 2.2,
    sugar: 0.8,
    sodium: 6,
    calcium: 12,
    iron: 0.8,
    potassium: 425
  }
];

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

  
  function selectQuickFood(food) {
  setForm({
    ...form,
    foodName: food.name,
    quantity: String(food.servingSize),
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
    calories: food.calories,
    fiber: food.fiber,
    sugar: food.sugar,
    sodium: food.sodium,
    calcium: food.calcium,
    iron: food.iron,
    potassium: food.potassium
  });
}

  function calculateNutritionFromFoodName() {
  const searchText = form.foodName.trim().toLowerCase();

  if (searchText === "") {
    alert("Enter a food name first.");
    return;
  }

  const matchedFood = quickFoods.find(function (food) {
    return (
      food.name.toLowerCase().includes(searchText) ||
      searchText.includes(food.name.toLowerCase())
    );
  });

  if (!matchedFood) {
    alert(
      "Food not found in the current library. Try Chicken Breast, Egg, Rice, Greek Yogurt, Protein Shake, Banana, Salmon, or Potato."
    );
    return;
  }

  const quantity = Number(form.quantity || matchedFood.servingSize);

  if (!quantity || quantity <= 0) {
    alert("Enter a valid quantity.");
    return;
  }

  const scaleFactor = quantity / matchedFood.servingSize;

  setForm({
    ...form,
    foodName: matchedFood.name,
    quantity: String(quantity),
    protein: (matchedFood.protein * scaleFactor).toFixed(1),
    carbs: (matchedFood.carbs * scaleFactor).toFixed(1),
    fat: (matchedFood.fat * scaleFactor).toFixed(1),
    calories: Math.round(matchedFood.calories * scaleFactor),
    fiber: (matchedFood.fiber * scaleFactor).toFixed(1),
    sugar: (matchedFood.sugar * scaleFactor).toFixed(1),
    sodium: Math.round(matchedFood.sodium * scaleFactor),
    calcium: Math.round(matchedFood.calcium * scaleFactor),
    iron: (matchedFood.iron * scaleFactor).toFixed(1),
    potassium: Math.round(matchedFood.potassium * scaleFactor)
  });
}

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
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    padding: "22px",
    borderRadius: "24px",
    boxShadow: "0 20px 45px rgba(15, 23, 42, 0.10)",
    border: "1px solid rgba(226, 232, 240, 0.9)",
    marginBottom: "18px",
    backdropFilter: "blur(14px)"
  };

  const heroStyle = {
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #0f766e 100%)",
    color: "white",
    borderRadius: "30px",
    padding: "30px",
    marginBottom: "22px",
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.25)",
    position: "relative",
    overflow: "hidden"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    marginTop: "7px",
    marginBottom: "14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontSize: "15px",
    outline: "none",
    boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.06)"
  };

  const buttonStyle = {
    background:
      "linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "800",
    boxShadow: "0 12px 24px rgba(37, 99, 235, 0.28)"
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
        <div style={heroStyle}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(255,255,255,0.14)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: "700",
              marginBottom: "16px"
            }}
          >
            🥗 Personal Nutrition Dashboard
          </div>

          <h1
            style={{
              color: "white",
              fontSize: "42px",
              lineHeight: "1.05",
              marginBottom: "10px",
              letterSpacing: "-0.04em"
            }}
          >
            NutriPilot
          </h1>

          <p
            style={{
              color: "#dbeafe",
              fontSize: "18px",
              maxWidth: "720px",
              marginBottom: "0"
            }}
          >
            Track meals, photos, macros, calories, goals, and daily nutrition decisions in one clean dashboard.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "16px",
            marginBottom: "24px"
          }}
        >
          <div style={cardStyle}>
            <h3>💪 Protein Progress</h3>
            <div
              style={{
                width: "100%",
                height: "10px",
                background: "#e2e8f0",
                borderRadius: "999px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${Math.min(
                    (totals.protein / profile.proteinGoal) * 100,
                    100
                  )}%`,
                  height: "100%",
                  background: "linear-gradient(90deg,#22c55e,#16a34a)"
                }}
              />
            </div>

            <p style={{ marginTop: "8px" }}>
              {totals.protein.toFixed(1)}g / {profile.proteinGoal}g
            </p>
          </div>

          <div style={cardStyle}>
            <h3>🔥 Calories</h3>
            <h2>
              {totals.calories} / {profile.calorieGoal}
            </h2>
          </div>

          <div style={cardStyle}>
            <h3>⚡ Current Weight</h3>
            <h2>{profile.weight || "--"}</h2>
          </div>

          <div style={cardStyle}>
            <h3>🎯 Remaining Protein</h3>
            <h2>
              {Math.max(
                profile.proteinGoal - totals.protein,
                0
              ).toFixed(0)}
              g
            </h2>
          </div>
        </div>
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
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "16px"
              }}
            >
              {quickFoods.map((food) => (
                <button
                  key={food.name}
                  type="button"
                  onClick={() => selectQuickFood(food)}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    borderRadius: "999px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  {food.emoji} {food.name}
                </button>
              ))}
            </div>
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
            <p
              style={{
                fontSize: "12px",
                color: "#64748b",
                marginTop: "2px",
                marginBottom: "12px"
              }}
            >
              Enter grams (example: 250)
            </p>

            <input
              style={inputStyle}
              value={form.quantity}
              placeholder="100"
              onChange={function (event) {
                setForm({ ...form, quantity: event.target.value });
              }}
            />
            
            <button
              type="button"
              onClick={calculateNutritionFromFoodName}
              style={{
                ...buttonStyle,
                width: "100%",
                marginBottom: "16px",
                background: "linear-gradient(135deg,#16a34a,#22c55e)"
              }}
            >
              Calculate Nutrition
            </button>
        
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