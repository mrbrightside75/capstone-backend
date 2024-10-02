import { Sequelize } from "sequelize";
import CaseModel from "./Case.js";
import ReferralModel from "./Referral.js";
import ServiceCoordinatorModel from "./ServiceCoordinator.js" 
import seedData from "./seedData.json" with {type: "json"};
import serviceCoordinatorsSeedData from "./serviceCoordinatorsSeedData.json" with {type: "json"}; // Import the seed data for service coordinators

let db;
if (process.env.DATABASE_URL === undefined) {
	console.log("Connected locally!");
	db = new Sequelize("postgres://localhost:5432/capstone", {
		logging: false,
	});
} else {
	db = new Sequelize(process.env.DATABASE_URL, {
		logging: false,
	});
}

const Case = CaseModel(db);
const Referral = ReferralModel(db);
const ServiceCoordinator = ServiceCoordinatorModel(db); // Define the ServiceCoordinator model

Case.hasMany(Referral, { foreignKey: "caseId", onDelete: "CASCADE" });
Referral.belongsTo(Case, { foreignKey: "caseId" });

const connectToDB = async () => {
	try {
		await db.authenticate();
		console.log("Connected to the DB");
		await db.sync({ alter: true }); // Sync the database with { alter: true }

		// Seed Cases
		for (const eachSeed of seedData) {
			const existingCase = await Case.findOne({
				where: {
					firstname: eachSeed.firstname,
					lastname: eachSeed.lastname,
					dateofbirth: eachSeed.dateofbirth,
				},
			});

			if (existingCase) {
				console.log(
					`Skipping case: ${eachSeed.firstname} ${eachSeed.lastname} - already exists.`
				);
			} else {
				await Case.create(eachSeed);
				console.log(
					`Added case: ${eachSeed.firstname} ${eachSeed.lastname}`
				);
			}
		}

		// Seed Service Coordinators
		for (const coordinator of serviceCoordinatorsSeedData) {
			const existingCoordinator = await ServiceCoordinator.findOne({
				where: {
					firstname: coordinator.firstname,
					lastname: coordinator.lastname,
				},
			});

			if (existingCoordinator) {
				console.log(
					`Skipping Service Coordinator: ${coordinator.firstname} ${coordinator.lastname} - already exists.`
				);
			} else {
				await ServiceCoordinator.create(coordinator);
				console.log(
					`Added Service Coordinator: ${coordinator.firstname} ${coordinator.lastname}`
				);
			}
		}
	} catch (error) {
		console.error(error);
		console.error("DB ISSUE! EVERYONE PANIC!");
	}
};
await connectToDB();

export { db, Case, Referral, ServiceCoordinator }; // Make sure to export ServiceCoordinator
