import { DataTypes } from "sequelize";
const Referral = (db) => {
	return db.define("referral", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		referralDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		referralAgency: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		referralReason: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		caseId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "cases", // This should match your Case table name
				key: "id",
			},
		},
	});
};

export default Referral;
