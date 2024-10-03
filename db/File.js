import { DataTypes } from "sequelize";

// Define the File model
const File = (db) => {
	return db.define(
		"File",
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false, // You can adjust this based on your needs
			},
			data: {
				type: "BYTEA", // Store PDF as binary data (blob)
				allowNull: false,
			},
			caseId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "cases", // Assuming the table name is "cases"
					key: "id",
				},
			},
		},
		{
			timestamps: true, // Adds createdAt and updatedAt fields
			tableName: "Files", // Explicitly set the table name if you want
		}
	);
};

export default File;
