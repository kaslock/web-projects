const Sequelize = require("sequelize");

module.exports = class Image extends Sequelize.Model {
    static init(sequelize){
        return super.init(
            {
                src:{
                    type:Sequelize.TEXT
                }
            },
            {
                sequelize,
                timestamps: true,
                underscored: true,
                paranoid: false,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci"
            }
        )
    }

    static associate(db) {
        // foreignKey:"rood_id"
        db.Image.belongsTo(db.Room, {foreignKey:"room_id", targetKey:"id"})
    }
}