export async function analyzePhoto(photo) {
  if (!photo) {
    throw new Error("No photo provided.");
  }

  await new Promise(function (resolve) {
    setTimeout(resolve, 1000);
  });

  return {
    foodName: "Chia Pudding with Berries",
    calories: 450,
    protein: 12,
    carbs: 42,
    fat: 22,
    fiber: 15,
    sugar: 12,
    sodium: 120,
    calcium: 180,
    iron: 3,
    potassium: 450,
    confidence: 75,
    notes:
      "This is still a mock AI result. Real photo recognition will be connected later through a backend."
  };
}