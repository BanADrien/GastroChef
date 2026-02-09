const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Ingredient = require('./models/Ingredient');
const Recipe = require('./models/Recipe');

dotenv.config();
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/gastrochef';

async function main(){
  await mongoose.connect(uri);
  console.log('connected');
  await Ingredient.deleteMany({});
  await Recipe.deleteMany({});
  const ingredients = [
    { key: 'tomato', name: 'Tomato', price: 1 },
    { key: 'lettuce', name: 'Lettuce', price: 1 },
    { key: 'cheese', name: 'Cheese', price: 2 },
    { key: 'bread', name: 'Bread', price: 1 }
  ];
  await Ingredient.insertMany(ingredients);
  // sample salad recipe (3x3: center row lettuce,tomato,cheese)
  const salad = { key: 'sample-salad', name: 'Sample Salad', pattern: [null,null,null,'lettuce','tomato','cheese',null,null,null], price: 8 };
  await Recipe.create(salad);
  console.log('seeded');
  process.exit(0);
}

main().catch(err=>{console.error(err);process.exit(1)});
