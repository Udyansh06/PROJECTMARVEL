import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views')); // assumes your EJS files are in /views

// Pre-load static JSON data once at startup (optional for performance)
const dataPath = path.join(process.cwd(), 'data', 'data.json');

// Reads JSON file every request (useful if you want always-fresh data after each deployment)
function getMarvelData() {
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

app.get('/', (req, res) => {
  const heroesData = getMarvelData();
  res.render('index.ejs', { data: heroesData });
});

app.get('/character/:id', (req, res) => {
  const reqid = parseInt(req.params.id);
  const allcharacters = getMarvelData();
  const character = allcharacters.find((character) => character && character.id === reqid);
  if (!character) {
    return res.status(404).send("Item not found");
  }
  res.render('character.ejs', { character });
});

// No app.listen()

export default app;


// import express from 'express';
// import axios from 'axios';
// import crypto from 'crypto';
// import fs from 'fs';

// const app = express();
// const publicKey = 'd6403b7807c973e35d0b6cbc3da7c94f';
// const privateKey = '7ee67dfce2b1f022e072f414c4bd29b0bfa5caf4';
// const baseURL = 'https://gateway.marvel.com/v1/public/characters';

// app.use(express.static("public"));

// function getMarvelHash(ts) {
//   return crypto.createHash('md5').update(ts + privateKey + publicKey).digest('hex');
// }

// If you want to fetch live data from Marvel API, uncomment and adjust the code below
// app.get('/', async (req, res) => {
//   try {
//     const heroes = ['Iron Man','Spider-Man (Peter Parker)','Thor', 'Captain america', 'Hulk','Loki','Hawkeye','Black Widow','Daredevil','Black Panther','Wolverine','Punisher','Doctor Strange','Deadpool','Moon Knight','Star Lord','Nova','Ghost Rider','Blade','Invisible Woman','Silver Surfer','Quicksilver','Thanos','Gambit','Winter Soldier'];
//     const ts = Date.now().toString();
//     const hash = getMarvelHash(ts);
//     const heroPromises = heroes.map(async name => {
//        const response = await axios.get(baseURL, {
//          params: { name, ts, apikey: publicKey, hash }
//        });
//        return response.data.data.results[0];
//      });
//     const heroesData = await Promise.all(heroPromises);
//     res.render('index.ejs', { data: heroesData });
//     fs.writeFileSync('data.json', JSON.stringify(heroesData));
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error fetching Marvel heroes data');
//   }
// });

// app.get('/', (req, res) => {
//   res.render('index.ejs', { data: JSON.parse(fs.readFileSync('data.json')) });
// });

// app.get('/character/:id', (req, res) => {
//   const reqid = parseInt(req.params.id);
//   const allcharacters = JSON.parse(fs.readFileSync('data.json'));
//   const character = allcharacters.find(
//     (character) => character && character.id === reqid
//   );
//   if (!character) {
//     return res.status(404).send("Item not found");
//   }
//   res.render('character.ejs', { character });
// });

// export default app;
