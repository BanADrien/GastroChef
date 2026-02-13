const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;


// Route simple pour tester l'API
app.get('/', (req, res) => res.send('GastroChef API'));

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gastrochef', {useNewUrlParser:true,useUnifiedTopology:true})
  .then(()=>console.log('Mongo connecté'))
  .catch(err=>console.error(err));

// Importation des routes principales
app.use('/auth', require('./routes/auth'));
app.use('/lab', require('./routes/lab'));
app.use('/market', require('./routes/marketplace'));
app.use('/shop', require('./routes/shop'));

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error('Erreur globale :', err);
  res.status(500).json({ error: err.message || 'Erreur interne du serveur' });
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });


// Génération simple de commandes pour les clients connectés
io.on('connection', (socket) => {
  console.log('Socket connecté', socket.id);
  // Envoie une commande de test toutes les 15 secondes (en production, rendre configurable)
  const sendOrder = () => {
    const order = {
      id: Date.now(),
      recipeKey: 'sample-salad',
      expiresAt: Date.now() + 30_000
    };
    socket.emit('order:new', order);
  };
  const t = setInterval(sendOrder, 15000);
  socket.on('disconnect', ()=> clearInterval(t));
});

server.listen(PORT, ()=> console.log('Server listening', PORT));
