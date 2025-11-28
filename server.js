const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const mongoose = require("mongoose");
const multer = require("multer");
const app = express();

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/f1circuits", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

const circuitSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  slug: { type: String, required: true },
  location: { type: String, required: true, minlength: 3 },
  img_name: { type: String, default: "/images/default-circuit.jpg" },
  length_km: { type: Number, required: true, min: 0.1 },
  laps: { type: Number, required: true, min: 1 },
  drs_zones: { type: Number, required: true, min: 0 },
  opened: { type: Number, required: true, min: 1900 },
});

const Circuit = mongoose.model("Circuit", circuitSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const validateCircuit = (circuit) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    location: Joi.string().min(3).required(),
    length_km: Joi.number().min(0.1).required(),
    laps: Joi.number().integer().min(1).required(),
    drs_zones: Joi.number().integer().min(0).required(),
    opened: Joi.number()
      .integer()
      .min(1900)
      .max(new Date().getFullYear())
      .required(),
  });
  return schema.validate(circuit);
};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/circuits", async (req, res) => {
  try {
    const circuits = await Circuit.find();
    res.send(circuits);
  } catch (error) {
    res.status(500).send("Error fetching circuits: " + error.message);
  }
});

app.get("/api/circuits/:id", async (req, res) => {
  try {
    const circuit = await Circuit.findById(req.params.id);

    if (!circuit) {
      res.status(404).send("The circuit with the given ID was not found");
      return;
    }

    res.send(circuit);
  } catch (error) {
    res.status(500).send("Error fetching circuit: " + error.message);
  }
});

app.post("/api/circuits", upload.single("img"), async (req, res) => {
  const result = validateCircuit(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const slug = req.body.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const circuit = new Circuit({
    name: req.body.name,
    slug: slug,
    location: req.body.location,
    img_name: req.file ? "/images/" + req.file.filename : "/images/default-circuit.jpg",
    length_km: req.body.length_km,
    laps: req.body.laps,
    drs_zones: req.body.drs_zones,
    opened: req.body.opened,
  });

  try {
    const savedCircuit = await circuit.save();
    res.status(201).send(savedCircuit);
  } catch (error) {
    res.status(500).send("Error saving circuit: " + error.message);
  }
});

app.put("/api/circuits/:id", upload.single("img"), async (req, res) => {
  const result = validateCircuit(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const slug = req.body.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  try {
    const updateData = {
      name: req.body.name,
      slug: slug,
      location: req.body.location,
      length_km: req.body.length_km,
      laps: req.body.laps,
      drs_zones: req.body.drs_zones,
      opened: req.body.opened,
    };

    if (req.file) {
      updateData.img_name = "/images/" + req.file.filename;
    }

    const circuit = await Circuit.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!circuit) {
      res.status(404).send("The circuit with the given ID was not found");
      return;
    }

    res.status(200).send(circuit);
  } catch (error) {
    res.status(500).send("Error updating circuit: " + error.message);
  }
});

app.delete("/api/circuits/:id", async (req, res) => {
  try {
    const circuit = await Circuit.findByIdAndDelete(req.params.id);

    if (!circuit) {
      res.status(404).send("The circuit with the given ID was not found");
      return;
    }

    res.status(200).send(circuit);
  } catch (error) {
    res.status(500).send("Error deleting circuit: " + error.message);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});