module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
        {
            tableName: 'users',
            timestamps: true
        });
    return User;
}

// insert into users (id, username, createdAt, updatedAt)
// values 
// (1, 'Atul', '2025-05-08 10:00:00', '2025-05-08 10:00:00'),
// (2, 'Nitin', '2025-05-08 10:01:00', '2025-05-08 10:01:00');