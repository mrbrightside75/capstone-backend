import express from "express";
import cors from "cors";
import { db, Case, Referral, ServiceCoordinator } from "./db/db.js"; // Ensure Referral is imported if not already

const server = express();
server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
	res.send({ server: "running" });
});

// Route to create a new case
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

// Route to create a referral for a case
server.post("/referrals", async (req, res) => {
	try {
		const { referralDate, referralAgency, referralReason, caseId } =
			req.body;

		// Ensure the case exists before creating the referral
		const existingCase = await Case.findByPk(caseId);

		if (!existingCase) {
			return res.status(404).json({ error: "Case not found" });
		}

		const newReferral = await Referral.create({
			referralDate,
			referralAgency,
			referralReason,
			caseId, // Associate the referral with the case
		});
		// Update the status of the associated case to 'Awaiting Validation'
		existingCase.status = "Awaiting Validation";
		await existingCase.save();

		res.status(201).json(newReferral);
	} catch (error) {
		console.error("Error creating referral:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Route to get all cases
server.get("/cases", async (req, res) => {
	try {
		const allCases = await Case.findAll(); // Fetch all cases from the database
		res.status(200).json(allCases); // Send them back as JSON
	} catch (error) {
		console.error("Error fetching cases:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Route to get a single case by caseId
server.get("/cases/:caseId", async (req, res) => {
	try {
		const caseData = await Case.findByPk(req.params.caseId); // Use caseId, not id
		if (!caseData) {
			return res.status(404).json({ error: "Case not found" });
		}
		res.status(200).json(caseData); // Send them back as JSON
	} catch (error) {
		console.error("Error fetching case:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Route to update the status of a case
server.put("/cases/:caseId/status", async (req, res) => {
	try {
		const { status } = req.body;
		const caseToUpdate = await Case.findByPk(req.params.caseId); // Use caseId, not id

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

server.get("/cases/:caseId/referrals", async (req, res) => {
	try {
		const { caseId } = req.params; // Get caseId from URL parameters
		const referrals = await Referral.findAll({ where: { caseId } }); // Find all referrals for the given caseId

		if (!referrals || referrals.length === 0) {
			return res
				.status(404)
				.json({ message: "No referrals found for this case." });
		}

		res.status(200).json(referrals); // Return referrals as JSON
	} catch (error) {
		console.error("Error fetching referrals:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Route to assign a service coordinator to a referral
server.post("/referrals/:referralId/assign", async (req, res) => {
	try {
		const { serviceCoordinatorId } = req.body; // Get the selected service coordinator ID
		const { referralId } = req.params;

		// Find the referral
		const referral = await Referral.findByPk(referralId);

		if (!referral) {
			return res.status(404).json({ error: "Referral not found" });
		}

		// Update the case associated with the referral
		const caseToUpdate = await Case.findByPk(referral.caseId);
		if (!caseToUpdate) {
			return res.status(404).json({ error: "Case not found" });
		}

		// Assign the service coordinator to the case
		caseToUpdate.serviceCoordinatorId = serviceCoordinatorId;
		await caseToUpdate.save();

		res.status(200).json({
			message: "Service Coordinator assigned successfully.",
		});
	} catch (error) {
		console.error("Error assigning service coordinator:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Route to fetch all service coordinators
server.get("/service-coordinators", async (req, res) => {
	try {
		const serviceCoordinators = await ServiceCoordinator.findAll(); // Assuming you have a ServiceCoordinator model
		res.status(200).json(serviceCoordinators); // Send the list as JSON
	} catch (error) {
		console.error("Error fetching service coordinators:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

server.listen(3001, "0.0.0.0", () => {
	console.log("Server is listening for requests");
});
