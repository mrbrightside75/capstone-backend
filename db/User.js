import { DataTypes } from "sequelize";

const User = (db) => {
	return db.define("user", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		role: {
			type: DataTypes.ENUM(
				"Admin",
				"Service Coordinator",
				"Supervisor",
				"Medical Records"
			),
			allowNull: false,
		},
	});
};

export default User;
