const Bonus = require("../models/bonusModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
exports.registerBonus = catchAsync(async(req, res, next) => {

    const placedMoney = req.body.placedMoney;
    const winMoney = req.body.winMoney;
    const matchDetail = req.body.matchDetail;

    const bonus = await Bonus.create({
        placedMoney: placedMoney,
        winMoney: winMoney,
        matchDetail: matchDetail
    });


    res.status(201).json({
        status: "success",
        message: "Match result posted successfully",
        bonus: bonus,
    });
});
exports.updateBonus = catchAsync(async(req, res, next) => {
    const bonusId = req.params.id;

    const checkBonusId = await Bonus.findById(bonusId);
    console.log(bonusId);
    if (checkBonusId) {
        console.log('am here');
        const bonus = await Bonus.findByIdAndUpdate(bonusId, {
            status: "finished"
        });

        res.status(201).json({
            status: "success",
            message: "Match result posted successfully",
            bonus: bonus,
        });
    }
});

exports.getBonusesForMob = catchAsync(async(req, res, next) => {
    let filter = { status: "pending" };

    const bonuses = await Bonus.find(filter);
    console.log('saminas');

    res.status(200).json({
        status: "success",
        results: bonuses.length,
        bonuses,
    });
});

exports.getAllBonuses = factory.getAll(Bonus);
exports.getSingleBonus = factory.getOne(Bonus);
exports.deleteBonus = factory.deleteOne(Bonus);