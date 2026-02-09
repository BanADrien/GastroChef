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

// simple route
app.get('/', (req, res) => res.send('GastroChef API'));

// connect mongo
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gastrochef', {useNewUrlParser:true,useUnifiedTopology:true})
  .then(()=>console.log('Mongo connected'))
  .catch(err=>console.error(err));

// routes (will create basic modules)
app.use('/auth', require('./routes/auth'));
app.use('/lab', require('./routes/lab'));
app.use('/market', require('./routes/marketplace'));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// simple order generation for connected clients
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  // send a test order every 15 seconds (in prod make it configurable)
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
