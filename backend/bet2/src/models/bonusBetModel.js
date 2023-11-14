const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const generate = require("nanoid/non-secure/generate");
const bonusBetSchema = new Schema({

    userName: {
        type: String,
    },
    userId: {
        type: String,
        unique: true,
        default: () => generate("123456789ABCDEF", 7),
    },
    payed: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["pending", "win", "loose"],
        default: "pending",
    },
    bonusId: {
        type: mongoose.Schema.ObjectId,
        ref: "Bonus",
    },
    placedMoney: {
        type: String,
        required: true
    },
    winMoney: {
        type: String,
        required: true,
    },
    momentDate: String,
    momentDateOnly: String,
    matchDetail: [{
        title: {
            type: String,
            trim: true,
            required: true,
        },
        choice: {
            type: String,
            enum: ["1", "2"],
            required: true,
        },
        date: {
            type: String,
            trim: true,
            required: true,
        },
    }],
}, {
    timestamps: true,
    toJson: {
        virtuals: true,
    },
    toObj: {
        virtuals: true,
    },
});

bonusBetSchema.pre(/^find/, function(next) {
    this.populate({
        path: "matchDetail",
        select: "-__v",
    });
    next();
});
module.exports = mongoose.model("BonusBet", bonusBetSchema);