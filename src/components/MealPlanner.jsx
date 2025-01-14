import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import citiesData from "../data/cities.json";
import { mealPlans } from "../data/meals";

export default function MealPlanner() {
  const [selectedState, setSelectedState] = useState("Haryana");
  const [selectedCity, setSelectedCity] = useState("Faridabad");
  const [meals, setMeals] = useState([]);
  const [date, setDate] = useState(new Date());

  const getMealPlan = (city) => {
    const plan = mealPlans[city] || {
      breakfast: ["Idli", "Dosa", "Poha"],
      lunch: ["Rajma Chawal", "Paneer Butter Masala", "Dal Fry"],
      dinner: ["Roti Sabzi", "Chicken Curry", "Vegetable Pulao"],
    };

    const days = Array.from({ length: 30 }, (_, i) => {
      const week = Math.floor(i / 7);
      const dayInWeek = i % 7;

      return {
        date: new Date(date.getFullYear(), date.getMonth(), i + 1),
        breakfast: plan.breakfast[(week + dayInWeek) % plan.breakfast.length],
        lunch: plan.lunch[(week + dayInWeek) % plan.lunch.length],
        dinner: plan.dinner[(week + dayInWeek) % plan.dinner.length],
      };
    });

    setMeals(days);
  };

  useEffect(() => {
    getMealPlan(selectedCity);
  }, [selectedCity]);

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity(citiesData[e.target.value][0]);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const renderMealItem = (icon, text) => (
    <div className="meal-item">
      <span className="meal-icon">{icon}</span>
      <span className="meal-text" title={text}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="meal-planner">
      <div className="location-selector">
        <select value={selectedState} onChange={handleStateChange}>
          {Object.keys(citiesData).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select value={selectedCity} onChange={handleCityChange}>
          {citiesData[selectedState].map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <Calendar
        onChange={setDate}
        value={date}
        tileContent={({ date, view }) => {
          if (view !== "month") return null;

          const dayMeals = meals.find(
            (m) =>
              m.date.getDate() === date.getDate() &&
              m.date.getMonth() === date.getMonth()
          );

          return (
            <div className="calendar-meals">
              {dayMeals && (
                <>
                  {renderMealItem("🍳", dayMeals.breakfast)}
                  {renderMealItem("🍲", dayMeals.lunch)}
                  {renderMealItem("🍽️", dayMeals.dinner)}
                </>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
