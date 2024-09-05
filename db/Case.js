// F5 Import DataTypes from Sequelize so we can define the types of the columns
import { DataTypes } from "sequelize";

// F6 This is a function, so we don't run it yet.
const Case = (db) => {
	// F10 We now have access to the DB from F8, so tell the database
	//to define a new model (table) with four columns and specify each
	// of their datatypes.
	return db.define("case", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		firstname: DataTypes.TEXT,
		lastname: DataTypes.TEXT,
		prefix: {
			type: DataTypes.ENUM,
			values: [
				"Mr.",
				"Mrs.",
				"Miss",
				"Ms.",
				"Dr.",
				"Prof.",
				"Rev.",
				"Sir",
				"Madam",
				"Mx.",
				"Hon.",
				"Lord",
				"Lady",
			],
			allowNull: true,
		},
		suffix: {
			type: DataTypes.ENUM,
			values: [
				"Jr.",
				"Sr.",
				"II",
				"III",
				"IV",
				"V",
				"PhD",
				"MD",
				"DDS",
				"Esq.",
				"CPA",
			],
			allowNull: true,
		},
		dateofbirth: DataTypes.DATE,
		gestationalage: {
			type: DataTypes.ENUM,
			values: Array.from({ length: 42 }, (_, i) => `${i + 1} weeks`),
		},
		ethnicity: {
			type: DataTypes.ENUM,
			values: ["Hispanic or Latino", "Not Hispanic or Latino"],
		},
		race: {
			type: DataTypes.ENUM,
			values: [
				"White",
				"Black or African American",
				"American Indian or Alaska Native",
				"Asian",
				"Native Hawaiian or Other Pacific Islander",
			],
		},
		address: DataTypes.TEXT,
		language: {
			type: DataTypes.ENUM,
			values: [
				"English",
				"Spanish",
				"Chinese (Mandarin, Cantonese)",
				"Tagalog",
				"Vietnamese",
				"French",
				"Arabic",
				"Korean",
				"Russian",
				"German",
				"Portuguese",
				"Japanese",
				"Hindi",
				"Urdu",
				"Persian (Farsi)",
				"Italian",
				"Polish",
				"Haitian Creole",
				"Hebrew",
				"Bengali",
				"Gujarati",
				"Greek",
				"Punjabi",
				"Thai",
				"Swahili",
				"Somali",
				"Burmese",
				"Amharic",
			],
		},
		schooldistrict: {
			type: DataTypes.ENUM,
			values: [
				"Baldwinsville Central School District",
				"East Syracuse Minoa Central School District",
				"Fabius-Pompey Central School District",
				"Fayetteville-Manlius Central School District",
				"Jamesville-Dewitt Central School District",
				"Jordan-Elbridge Central School District",
				"LaFayette Central School District",
				"Liverpool Central School District",
				"Lyncourt Union Free School District",
				"Marcellus Central School District",
				"North Syracuse Central School District",
				"Onondaga Central School District",
				"Skaneateles Central School District",
				"Solvay Union Free School District",
				"Syracuse City School District",
				"Tully Central School District",
				"West Genesee Central School District",
				"Westhill Central School District",
			],
		},
	});
};

// F7 Export the function so it can be accessed in db.js
export default Case;
// Test
