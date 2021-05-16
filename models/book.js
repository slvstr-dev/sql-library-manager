"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Book extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    Book.init(
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Please provide a value for "title".',
                    },
                },
            },
            author: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Please provide a value for "author".',
                    },
                },
            },
            genre: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    isInt: {
                        msg: 'Please provide an integer value for "year"',
                    },
                },
            },
        },
        {
            sequelize,
            modelName: "Book",
        }
    );

    return Book;
};
