const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

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

const validateCircuit = (circuit) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    location: Joi.string().min(3).required(),
    length_km: Joi.number().min(0.1).required(),
    laps: Joi.number().integer().min(1).required(),
    drs_zones: Joi.number().integer().min(0).required(),
    opened: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  });
  return schema.validate(circuit);
};

app.get("/api/circuits", (req, res) => {
  res.send(circuits);
});

app.get("/api/circuits/:id", (req, res) => {
  const circuit = circuits.find((c) => c._id === parseInt(req.params.id));
  
  if (!circuit) {
    res.status(404).send("The circuit with the given ID was not found");
    return;
  }
  
  res.send(circuit);
});

app.post("/api/circuits", (req, res) => {
  const result = validateCircuit(req.body);
  
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const slug = req.body.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const circuit = {
    _id: circuits.length + 1,
    name: req.body.name,
    slug: slug,
    location: req.body.location,
    img_name: "/images/default-circuit.jpg",
    length_km: req.body.length_km,
    laps: req.body.laps,
    drs_zones: req.body.drs_zones,
    opened: req.body.opened,
  };

  circuits.push(circuit);
  
  res.status(201).send(circuit);
});

app.put("/api/circuits/:id", (req, res) => {
  const circuit = circuits.find((c) => c._id === parseInt(req.params.id));
  
  if (!circuit) {
    res.status(404).send("The circuit with the given ID was not found");
    return;
  }

  const result = validateCircuit(req.body);
  
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  circuit.name = req.body.name;
  circuit.location = req.body.location;
  circuit.length_km = req.body.length_km;
  circuit.laps = req.body.laps;
  circuit.drs_zones = req.body.drs_zones;
  circuit.opened = req.body.opened;

  circuit.slug = req.body.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  res.status(200).send(circuit);
});

app.delete("/api/circuits/:id", (req, res) => {
  const circuit = circuits.find((c) => c._id === parseInt(req.params.id));
  
  if (!circuit) {
    res.status(404).send("The circuit with the given ID was not found");
    return;
  }

  const index = circuits.indexOf(circuit);
  circuits.splice(index, 1);

  res.status(200).send(circuit);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
