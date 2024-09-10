import { Sequelize } from "sequelize";
import CaseModel from "./Case.js";
import seedData from "./seedData.json" with {type: "json"};

// process.env.DATABASE_URL
/*

1. process.env.DATABASE_URL === postgres://postgres:i5L9jcOJxzSUQlO@capstone-backend-little-water-8484-db.flycast:5432
2. DATABASE_URL === undefined


*/


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

const connectToDB = async () => {
	try {
		await db.authenticate();
		console.log("Connected to the DB");
		await db.sync(); // Sync the database (adjust with `alter: true` if needed)

		// Loop through the seed data
		for (const eachSeed of seedData) {
			// Check if the case already exists in the database by first name, last name, and DOB
			const existingCase = await Case.findOne({
				where: {
					firstname: eachSeed.firstname,
					lastname: eachSeed.lastname,
					dateofbirth: eachSeed.dateofbirth
				}
			});

			if (existingCase) {
				// If the case already exists, log a message and skip insertion
				console.log(
					`Skipping case: ${eachSeed.firstname} ${eachSeed.lastname} - already exists in the database.`
				);
			} else {
				// If the case does not exist, create a new case
				await Case.create(eachSeed);
				console.log(`Added case: ${eachSeed.firstname} ${eachSeed.lastname}`);
			}
		}
	} catch (error) {
		console.error(error);
		console.error("DB ISSUE! EVERYONE PANIC!");
	}
};
await connectToDB();

export { db, Case };
