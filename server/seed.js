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
    { key: 'tomate', name: 'Tomate', price: 1 },
    { key: 'salade', name: 'Salade', price: 1 },
    { key: 'fromage', name: 'Fromage', price: 2 },
    { key: 'pain', name: 'Pain', price: 1 },
    { key: 'riz', name: 'Riz', price: 1 },
    { key: 'boeuf', name: 'Boeuf', price: 3 },
    { key: 'poulet', name: 'Poulet', price: 2 },
    { key: 'pates', name: 'Pâtes', price: 1 },
    { key: 'patate', name: 'Patate', price: 1 },
    { key: 'oeuf', name: 'Oeuf', price: 1 }
  ];
  await Ingredient.insertMany(ingredients);

  const recipes = [
    { key: 'salade-composee', name: 'Salade Composée', image: 'salade composé.png', pattern: ['salade','tomate','fromage',null,null,null], price: 8 },
    { key: 'pates-bolo', name: 'Pâtes Bolognaise', image: 'pates bolo.png', pattern: ['pates','boeuf','tomate',null,null,null], price: 12 },
    { key: 'sandwich-club', name: 'Sandwich Club', image: 'sandwitch.png', pattern: ['pain','poulet','fromage',null,null,null], price: 10 },
    { key: 'gratin-patates', name: 'Gratin Patates', image: 'grattin.png', pattern: ['patate','fromage','oeuf',null,null,null], price: 9 },
    { key: 'chilli', name: 'Chilli', image: 'chilli.png', pattern: ['tomate','boeuf','riz',null,null,null], price: 13 }
  ];
  await Recipe.insertMany(recipes);
  console.log('seeded');
  process.exit(0);
}

main().catch(err=>{console.error(err);process.exit(1)});
