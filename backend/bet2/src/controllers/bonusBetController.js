const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");
const multer = require("multer");
const factory = require("./handlerFactory");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const generate = require("nanoid/non-secure/generate");
const Bonus = require("../models/bonusModel");
const BonusBet = require("../models/bonusBetModel");

exports.checkBonusBet = catchAsync(async(req, res, next) => {

    const bonusId = req.body.bonusId;
    const bonus = await Bonus.findById(bonusId);
    if (!bonus) {
        return next(new AppError("no bonus with that id", 404));
    }

    if (bonus.status == "finished") {
        return next(new AppError("bonus is finished", 405));
    }
    const matchDetail = req.body.matchDetail;
    if (matchDetail.length != bonus.matchDetail.length) {

        return next(new AppError("invalid matches", 404));
    }
    for (let i = 0; i < matchDetail.length; i++) {
        if (matchDetail[i].title.toUpperCase() != bonus.matchDetail[i].title.toUpperCase()) {

            return next(new AppError("match not found", 404));
        }
        // if (matchDetail[i].choice == '1' || matchDetail[i].choice == '2') {
        //     return next(new AppError("invalid choice", 403));
        // }
    }
    const bonusBet = await BonusBet.find({ bonusId: bonusId, payed: true });
    console.log(bonusBet.length);
    if (bonusBet.length > 15) {
        console.log('dd');
        bonus.status = 'finished';
        await Bonus.findByIdAndUpdate(bonusId, { status: 'finished' }, {
            runValidators: true,
            new: true,
        });
        // return next(new Ap)
    }


    req.body.placedMoney = bonus.placedMoney;

    req.body.winMoney = bonus.winMoney;
    // console.log(placedMoney);
    next();
});

exports.createBonusBet = catchAsync(async(req, res, next) => {
    const formattedDate = moment(Date.now()).format("MMMM D, YYYY h:mm:ss A");
    const dateOnly = moment(Date.now()).format("DD-MM-YYYY");
    const placedMoney = req.body.placedMoney;
    var winMoney = req.body.winMoney;
    var bonusId = req.body.bonusId;


    let userName = req.body.userName;
    if (userName == '' || userName == undefined) {
        userName = "no_name";
    }
    const matchDetail = req.body.matchDetail;
    let result = [];




    const firstBet = await BonusBet.create({
        userName: userName,
        placedMoney: placedMoney.toString(),
        winMoney: winMoney.toString(),
        bonusId: bonusId,
        momentDate: formattedDate,
        momentDateOnly: dateOnly,
        matchDetail: matchDetail,
    });


    const bet = await BonusBet.findById(firstBet._id);
    console.log('saminas');

    if (!bet) {
        return next(new AppError("No bets found", 404));
    }

    res.status(201).json({
        status: "success",
        bet,
        result,
    });
});

exports.getAllBonusBets = factory.getAll(BonusBet);
exports.getSingleBonusBet = factory.getOne(BonusBet);

exports.getActiveBonus = catchAsync(async(req, res, next) => {
    console.log('saminas');

    const bonus = await Bonus.find({ status: 'pending' });
    if (!bonus) {
        return next(new AppError("No pending bonuses", 404));
    }
    res.status(200).json({
        status: "success",
        bonus
    });
});
exports.updateBonusBet = catchAsync(async(req, res, next) => {
    const betId = req.params.id;
    const payed = req.body.payed;

    if (payed != null) {
        const bet1 = await BonusBet.findById(betId);
        now = Date.now();
        if (now - new Date(bet1.createdAt) > 1200000) {
            await BonusBet.findByIdAndDelete(betId);
            return next(new AppError("Error betting, bet timeout", 403));
        }
        const bet = await BonusBet.findByIdAndUpdate(betId, {
            payed: payed,
        }, {
            runValidators: true,
            new: true,
        });
        if (!bet) {
            return next(new AppError("No bets found", 404));
        }
        res.status(200).json({
            status: "success",
            bet,
        });
    } else {
        return next(new AppError("specify condition", 403));
    }
});
exports.updateStatusBonusBet = catchAsync(async(req, res, next) => {
    const betId = req.params.id;
    const status = req.body.status;
    const payedBet = await BonusBet.findById(betId);
    if (payedBet.payed != true) {
        return next(new AppError("The user has not paid for this bet", 403));
    }
    if (status != null) {
        const bet = await BonusBet.findByIdAndUpdate(betId, {
            status: status,
        }, {
            runValidators: true,
            new: true,
        });
        if (!bet) {
            return next(new AppError("No bets found", 404));
        }
        res.status(200).json({
            status: "success",
            bet,
        });
    } else {
        return next(new AppError("specify condition", 403));
    }
});