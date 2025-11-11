const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Circuits data array
let circuits = [
  {
    _id: 1,
    name: "Melbourne Grand Prix Circuit",
    slug: "melbourne",
    location: "Melbourne, Australia",
    img_name: "/images/melbourne2.avif",
    length_km: 5.278,
    laps: 58,
    drs_zones: 4,
    opened: 1996,
  },
  {
    _id: 2,
    name: "Shanghai International Circuit",
    slug: "shanghai",
    location: "Shanghai, China",
    img_name: "/images/shanghai.jpg",
    length_km: 5.451,
    laps: 56,
    drs_zones: 2,
    opened: 2004,
  },
  {
    _id: 3,
    name: "Suzuka Circuit",
    slug: "suzuka",
    location: "Suzuka, Japan",
    img_name: "/images/suzuka.webp",
    length_km: 5.807,
    laps: 53,
    drs_zones: 1,
    opened: 1962,
  },
  {
    _id: 4,
    name: "Bahrain International Circuit",
    slug: "bahrain",
    location: "Sakhir, Bahrain",
    img_name: "/images/bahrain.jpg",
    length_km: 5.412,
    laps: 57,
    drs_zones: 3,
    opened: 2004,
  },
  {
    _id: 5,
    name: "Jeddah Corniche Circuit",
    slug: "jeddah",
    location: "Jeddah, Saudi Arabia",
    img_name: "/images/jeddah.jpg",
    length_km: 6.174,
    laps: 50,
    drs_zones: 3,
    opened: 2021,
  },
  {
    _id: 6,
    name: "Miami International Autodrome",
    slug: "miami",
    location: "Miami, Florida, USA",
    img_name: "/images/miami3.avif",
    length_km: 5.412,
    laps: 57,
    drs_zones: 3,
    opened: 2022,
  },
  {
    _id: 7,
    name: "Autodromo Enzo e Dino Ferrari (Imola)",
    slug: "imola",
    location: "Imola, Italy",
    img_name: "/images/imola2.webp",
    length_km: 4.909,
    laps: 63,
    drs_zones: 1,
    opened: 1953,
  },
  {
    _id: 8,
    name: "Circuit de Monaco",
    slug: "monaco",
    location: "Monaco",
    img_name: "/images/monaco.avif",
    length_km: 3.337,
    laps: 78,
    drs_zones: 1,
    opened: 1929,
  },
  {
    _id: 9,
    name: "Circuit de Barcelona-Catalunya",
    slug: "barcelona",
    location: "Barcelona, Spain",
    img_name: "/images/barcelona.avif",
    length_km: 4.657,
    laps: 66,
    drs_zones: 2,
    opened: 1991,
  },
];

// GET all circuits
app.get("/api/circuits", (req, res) => {
  res.send(circuits);
});

// GET single circuit by ID
app.get("/api/circuits/:id", (req, res) => {
  const circuit = circuits.find((c) => c._id === parseInt(req.params.id));
  
  if (!circuit) {
    res.status(404).send("The circuit with the given ID was not found");
    return;
  }
  
  res.send(circuit);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});