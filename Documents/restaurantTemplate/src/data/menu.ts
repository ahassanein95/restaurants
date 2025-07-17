import { MenuCategory } from '@/types/restaurant';

export const menuData: MenuCategory[] = [
  {
    id: "appetizers",
    name: "Appetizers",
    description: "Start your meal with these delicious options",
    order: 1,
    items: [
      {
        id: "bruschetta",
        name: "Bruschetta Classica",
        description: "Toasted bread topped with fresh tomatoes, basil, and garlic",
        price: 12.99,
        category: "appetizers",
        image: "/images/food/bruschetta.jpg",
        dietary: [{ type: "vegetarian" }],
        popular: true
      },
      {
        id: "calamari",
        name: "Calamari Fritti",
        description: "Crispy fried squid rings served with marinara sauce",
        price: 15.99,
        category: "appetizers",
        image: "/images/food/calamari.jpg",
        dietary: []
      },
      {
        id: "antipasto",
        name: "Antipasto Platter",
        description: "Selection of cured meats, cheeses, olives, and vegetables",
        price: 18.99,
        category: "appetizers",
        image: "/images/food/antipasto.jpg",
        dietary: [{ type: "gluten-free" }]
      }
    ]
  },
  {
    id: "pasta",
    name: "Pasta",
    description: "Handmade pasta with traditional sauces",
    order: 2,
    items: [
      {
        id: "spaghetti-carbonara",
        name: "Spaghetti Carbonara",
        description: "Classic Roman pasta with eggs, cheese, pancetta, and black pepper",
        price: 19.99,
        category: "pasta",
        image: "/images/food/carbonara.jpg",
        dietary: [],
        featured: true
      },
      {
        id: "fettuccine-alfredo",
        name: "Fettuccine Alfredo",
        description: "Rich and creamy butter and parmesan sauce over fresh fettuccine",
        price: 17.99,
        category: "pasta",
        image: "/images/food/alfredo.jpg",
        dietary: [{ type: "vegetarian" }]
      },
      {
        id: "penne-arrabbiata",
        name: "Penne all'Arrabbiata",
        description: "Spicy tomato sauce with garlic and red peppers",
        price: 16.99,
        category: "pasta",
        image: "/images/food/arrabbiata.jpg",
        dietary: [{ type: "vegan" }, { type: "spicy", level: 2 }]
      }
    ]
  },
  {
    id: "pizza",
    name: "Pizza",
    description: "Wood-fired pizzas with fresh ingredients",
    order: 3,
    items: [
      {
        id: "margherita",
        name: "Pizza Margherita",
        description: "San Marzano tomatoes, fresh mozzarella, basil, and olive oil",
        price: 16.99,
        category: "pizza",
        image: "/images/food/margherita.jpg",
        dietary: [{ type: "vegetarian" }],
        popular: true
      },
      {
        id: "pepperoni",
        name: "Pizza Pepperoni",
        description: "Classic pepperoni with mozzarella and tomato sauce",
        price: 18.99,
        category: "pizza",
        image: "/images/food/pepperoni.jpg",
        dietary: []
      },
      {
        id: "quattro-stagioni",
        name: "Pizza Quattro Stagioni",
        description: "Four seasons pizza with artichokes, mushrooms, ham, and olives",
        price: 21.99,
        category: "pizza",
        image: "/images/food/quattro-stagioni.jpg",
        dietary: []
      }
    ]
  },
  {
    id: "mains",
    name: "Main Courses",
    description: "Hearty Italian main dishes",
    order: 4,
    items: [
      {
        id: "osso-buco",
        name: "Osso Buco",
        description: "Braised veal shanks with vegetables and white wine",
        price: 32.99,
        category: "mains",
        image: "/images/food/osso-buco.jpg",
        dietary: [{ type: "gluten-free" }],
        featured: true
      },
      {
        id: "chicken-parmigiana",
        name: "Chicken Parmigiana",
        description: "Breaded chicken breast with marinara and mozzarella",
        price: 24.99,
        category: "mains",
        image: "/images/food/chicken-parm.jpg",
        dietary: []
      },
      {
        id: "salmon-piccata",
        name: "Salmon Piccata",
        description: "Pan-seared salmon with lemon caper sauce",
        price: 28.99,
        category: "mains",
        image: "/images/food/salmon-piccata.jpg",
        dietary: [{ type: "gluten-free" }]
      }
    ]
  },
  {
    id: "desserts",
    name: "Desserts",
    description: "Sweet endings to your meal",
    order: 5,
    items: [
      {
        id: "tiramisu",
        name: "Tiramisu",
        description: "Classic Italian coffee-flavored dessert with mascarpone",
        price: 8.99,
        category: "desserts",
        image: "/images/food/tiramisu.jpg",
        dietary: [{ type: "vegetarian" }],
        popular: true
      },
      {
        id: "panna-cotta",
        name: "Panna Cotta",
        description: "Silky vanilla custard with berry compote",
        price: 7.99,
        category: "desserts",
        image: "/images/food/panna-cotta.jpg",
        dietary: [{ type: "vegetarian" }, { type: "gluten-free" }]
      },
      {
        id: "gelato",
        name: "Gelato Trio",
        description: "Three scoops of artisanal gelato - ask for today's flavors",
        price: 9.99,
        category: "desserts",
        image: "/images/food/gelato.jpg",
        dietary: [{ type: "vegetarian" }]
      }
    ]
  }
];