import { DataTypes } from "sequelize";

const ServiceCoordinator = (db) => {
	return db.define("ServiceCoordinator", {
		firstname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
};

export default ServiceCoordinator;
