import { Sequelize } from "sequelize";
import CaseModel from "./Case.js";

const db = new Sequelize("postgres://localhost:5432/capstone");
const Case = CaseModel(db);

const connectToDB = async () => {
	try {
		await db.authenticate();
		console.log("Connected to the DB");
		db.sync(); //{ alter: true }
	} catch (error) {
		console.error(error);
		console.error("DB ISSUE! EVERYONE PANIC!");
	}
};
connectToDB();

export { db, Case };
