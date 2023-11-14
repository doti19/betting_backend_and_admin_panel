const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bonusSchema = new Schema({

    status: {
        type: String,
        enum: ["pending", "finished"],
        default: "pending"
    },
    placedMoney: {
        type: String,
        required: true
    },
    winMoney: {
        type: String,
        required: true,
    },

    matchDetail: [{
        title: {
            type: String,
            trim: true,
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

bonusSchema.pre(/^find/, function(next) {
    this.populate({
        path: "matchDetail",
        select: "-__v",
    });
    next();
});
module.exports = mongoose.model("Bonus", bonusSchema);