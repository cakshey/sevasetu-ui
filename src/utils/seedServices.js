import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const seedServices = async () => {
  const sampleData = [
    {
      name: "Weekly Meal Prep",
      price: 799,
      description: "Home-cooked meals prepared weekly by expert cooks.",
      category: "Homemade / Cook",
    },
    {
      name: "Deep Cleaning",
      price: 1299,
      description: "Complete home deep cleaning service.",
      category: "Cleaning & Pest Control",
    },
    {
      name: "Termite Control",
      price: 999,
      description: "Eco-friendly pest control for your home.",
      category: "Cleaning & Pest Control",
    },
    {
      name: "Wall Painting",
      price: 499,
      description: "Beautiful wall painting service at your doorstep.",
      category: "Painting & Waterproofing",
    },
    {
      name: "Plumbing Repair",
      price: 299,
      description: "Quick fixes for pipes, taps, and leaks.",
      category: "Electrician, Plumber & Carpenter",
    },
  ];

  try {
    for (const item of sampleData) {
      await addDoc(collection(db, "services"), item);
    }
    console.log("✅ Services seeded successfully!");
  } catch (e) {
    console.error("❌ Error seeding data:", e);
  }
};

seedServices();
