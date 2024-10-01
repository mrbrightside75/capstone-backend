import express from "express";
import cors from "cors";
import { db, Case } from "./db/db.js";
// import { ClerkExpressWithAuth, createClerkClient } from "@clerk/clerk-sdk-node";
// import dotenv from "dotenv";

// dotenv.config();

// const clerkMiddleware = ClerkExpressWithAuth({
// 	apiKey: process.env.CLERK_SECRET_KEY,
// 	secretKey: process.env.CLERK_SECRET_KEY,
// });

const server = express();
server.use(cors());
server.use(express.json());
// server.use(clerkMiddleware);

// Define role-based middleware function
// const roleBasedMiddleware = (roles) => {
// 	return async (req, res, next) => {
// 		const { sessionId } = req.auth;
// 		try {
// 			const user = await Clerk.users.getUser(sessionId);

// 			if (roles.includes(user.publicMetadata.role)) {
// 				return next(); // Proceed if role is valid
// 			} else {
// 				return res.status(403).json({ message: "Unauthorized" });
// 			}
// 		} catch (error) {
// 			console.error("Error fetching user:", error);
// 			return res.status(500).json({ message: "Internal server error" });
// 		}
// 	};
// };

// // Example protected route
// server.get(
// 	"/protected",
// 	roleBasedMiddleware(["Admin", "Service Coordinator"]),
// 	(req, res) => {
// 		res.send(
// 			"This is a protected route only accessible to Admins and Service Coordinators"
// 		);
// 	}
// );

server.get("/", (req, res) => {
	res.send({ server: "running" });
});

server.post("/cases", async (req, res) => {
	try {
		const {
			firstname,
			lastname,
			prefix,
			suffix,
			dateofbirth,
			gestationalage,
			ethnicity,
			race,
			address,
			language,
			schooldistrict,
		} = req.body;
		// Create a new case in the database
		const newCase = await Case.create({
			// firstname,
			// lastname,
			// dateofbirth,
			firstname,
			lastname,
			prefix,
			suffix,
			dateofbirth,
			gestationalage,
			ethnicity,
			race,
			address,
			language,
			schooldistrict,
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

server.get("/cases/:id", async (req, res) => {
	try {
		const allCases = await Case.findByPk(req.params.id); // Fetch all cases from the database
		res.status(200).json(allCases); // Send them back as JSON
	} catch (error) {
		console.error("Error fetching cases:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Update the status of a case
server.put("/cases/:id/status", async (req, res) => {
	try {
		const { status } = req.body;
		const caseToUpdate = await Case.findByPk(req.params.id);

		if (!caseToUpdate) {
			return res.status(404).json({ error: "Case not found" });
		}

		// Update the case status
		caseToUpdate.status = status;
		await caseToUpdate.save();

		res.status(200).json(caseToUpdate);
	} catch (error) {
		console.error("Error updating case status:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

server.listen(3001, "0.0.0.0", () => {
	console.log("Server is listening for requests");
});
