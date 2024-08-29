import express from "express";
import cors from "cors";
import { db, Case } from "./db/db.js";

const server = express();
server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
	res.send({ server: "running" });
});

server.post("/cases", async (req, res) => {
	try {
		const { firstname, lastname, dateofbirth } = req.body;

		// Create a new case in the database
		const newCase = await Case.create({
			firstname,
			lastname,
			dateofbirth,
		});

		// Send a success response
		res.status(201).json(newCase);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

server.get("/cases", async (req, res) => {
	try {
		const allCases = await Case.findAll(); // Fetch all cases from the database
		res.status(200).json(allCases); // Send them back as JSON
	} catch (error) {
		console.error("Error fetching cases:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

server.listen(3001, () => {
	console.log("Server is listening for requests");
});
