const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Conexão usando a URL completa do NeonDB
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.DataTypes = DataTypes;

// Modelos
db.Profile = require('../models/Profile')(sequelize, DataTypes);
db.User = require('../models/User')(sequelize, DataTypes);
db.Location = require('../models/Location')(sequelize, DataTypes);
db.Event = require('../models/Event')(sequelize, DataTypes);
db.Ticket = require('../models/Ticket')(sequelize, DataTypes);

// Associações

// 1. User <-> Profile (1:N)
db.Profile.hasMany(db.User, { foreignKey: 'profile_id', as: 'users', onDelete: 'RESTRICT' });
db.User.belongsTo(db.Profile, { foreignKey: 'profile_id', as: 'profile', onDelete: 'RESTRICT' });

// 2. User <-> Event (1:N)
db.User.hasMany(db.Event, { foreignKey: 'creator_id', as: 'createdEvents', onDelete: 'CASCADE' });
db.Event.belongsTo(db.User, { foreignKey: 'creator_id', as: 'creator', onDelete: 'CASCADE' });

// 3. Event <-> Location (N:1)
db.Location.hasMany(db.Event, { foreignKey: 'location_id', as: 'events', onDelete: 'RESTRICT' });
db.Event.belongsTo(db.Location, { foreignKey: 'location_id', as: 'location', onDelete: 'RESTRICT' });

// 4. Ticket <-> User (N:1 - Comprador)
db.User.hasMany(db.Ticket, { foreignKey: 'user_id', as: 'ticketsBought', onDelete: 'CASCADE' });
db.Ticket.belongsTo(db.User, { foreignKey: 'user_id', as: 'buyer', onDelete: 'CASCADE' });

// 5. Ticket <-> Event (N:1)
db.Event.hasMany(db.Ticket, { foreignKey: 'event_id', as: 'tickets', onDelete: 'CASCADE' });
db.Ticket.belongsTo(db.Event, { foreignKey: 'event_id', as: 'event', onDelete: 'CASCADE' });

module.exports = db;