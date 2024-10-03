import express from "express";
import cors from "cors";
import { db, Case, Referral, ServiceCoordinator, File } from "./db/db.js";
import { PDFDocument, StandardFonts } from "pdf-lib";

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
			status,
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
			status,
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
// Update route to assign a service coordinator to a case
// Route to assign a service coordinator to a case and update the status
// server.post("/cases/:caseId/assign", async (req, res) => {
// 	try {
// 		const { serviceCoordinatorId, status } = req.body; // Get serviceCoordinatorId and status from the request body
// 		const { caseId } = req.params; // Get the caseId from the URL params

// 		// Find the case by caseId
// 		const caseToUpdate = await Case.findByPk(caseId);

// 		if (!caseToUpdate) {
// 			return res.status(404).json({ error: "Case not found" });
// 		}

// 		// Assign the service coordinator and update the status
// 		caseToUpdate.serviceCoordinatorId = serviceCoordinatorId;
// 		caseToUpdate.status = status || "Assigned"; // Default to "Assigned" if no status is provided
// 		await caseToUpdate.save();

// 		res.status(200).json({
// 			message:
// 				"Service Coordinator assigned and case status updated successfully.",
// 		});
// 	} catch (error) {
// 		console.error("Error assigning service coordinator:", error);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// });

server.post("/cases/:caseId/assign", async (req, res) => {
	try {
		const { serviceCoordinatorId } = req.body;
		const { caseId } = req.params;

		// Find the case and the service coordinator
		const caseToUpdate = await Case.findByPk(caseId);
		const serviceCoordinator = await ServiceCoordinator.findByPk(
			serviceCoordinatorId
		);

		if (!caseToUpdate) {
			console.error("Case not found:", caseId);
			return res.status(404).json({ error: "Case not found" });
		}
		if (!serviceCoordinator) {
			console.error(
				"Service Coordinator not found:",
				serviceCoordinatorId
			);
			return res
				.status(404)
				.json({ error: "Service Coordinator not found" });
		}

		// Update the case with the assigned service coordinator
		caseToUpdate.serviceCoordinatorId = serviceCoordinatorId;
		caseToUpdate.status = "Assigned"; // Update case status
		await caseToUpdate.save();

		// Generate PDF (optional: remove it for now to debug the issue)
		try {
			const { firstname, lastname, address, language, ethnicity, race } =
				caseToUpdate;

			// Create PDF logic (simplified for debugging)
			const pdfDoc = await PDFDocument.create();
			const timesRomanFont = await pdfDoc.embedFont(
				StandardFonts.TimesRoman
			);
			const page = pdfDoc.addPage([612, 792]);

			page.drawText(`${firstname} ${lastname}`, {
				x: 50,
				y: 700,
				size: 12,
				font: timesRomanFont,
			});
			page.drawText(`${address}`, {
				x: 50,
				y: 680,
				size: 12,
				font: timesRomanFont,
			});

			const pdfBytes = await pdfDoc.save();

			// Store the PDF as a file in the database, linked to the case
			const newFile = await File.create({
				name: `parent_letter_${firstname}_${lastname}.pdf`,
				data: pdfBytes,
				// Link the file to the case
				caseId: caseId,
			});

			// Respond with success
			return res.status(200).json({
				message:
					"Service Coordinator assigned and Parent Letter PDF generated successfully.",
				file: newFile,
			});
		} catch (pdfError) {
			console.error("Error generating PDF:", pdfError);
			return res.status(500).json({ error: "Error generating PDF" });
		}
	} catch (error) {
		console.error("Error assigning service coordinator:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

// Route to fetch all service coordinators
server.get("/cases/:caseId/files", async (req, res) => {
	try {
		const { caseId } = req.params;

		// Find the files associated with the case
		const files = await File.findAll({ where: { caseId } });

		if (!files || files.length === 0) {
			return res
				.status(404)
				.json({ error: "No files found for this case." });
		}

		// Return the files
		res.status(200).json(files);
	} catch (error) {
		console.error("Error fetching files:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Serve the PDF file from the database
server.get("/get-pdf/:id", async (req, res) => {
	try {
		const fileId = req.params.id;

		// Find the file by its primary key (ID)
		const file = await File.findByPk(fileId);

		if (!file) {
			return res.status(404).json({ error: "File not found" });
		}

		// Set the content type to PDF
		res.setHeader("Content-Type", "application/pdf");

		// Set content disposition to 'inline' to display the PDF in the browser
		res.setHeader("Content-Disposition", `inline; filename=${file.name}`);

		// Send the PDF data as binary
		res.send(file.data);
	} catch (error) {
		console.error("Error fetching the PDF:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

server.listen(3001, "0.0.0.0", () => {
	console.log("Server is listening for requests");
});
