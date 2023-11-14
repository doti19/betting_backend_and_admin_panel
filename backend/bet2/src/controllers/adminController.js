const mongoose = require("mongoose");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const Match = require("../models/matchModel");
const League = require("../models/leagueModel");
const Bet = require("../models/betModel");
const Result = require("../models/resultModel");
const Bonus = require("../models/bonusModel");
const BonusBet = require("../models/bonusBetModel");
exports.login = catchAsync(async(req, res, next) => {
    res.status(200).render('login');
});
exports.signUp = catchAsync(async(req, res, next) => {
    res.status(200).render('signup');
});
exports.adminHome = catchAsync(async(req, res, next) => {
    let week = new Date(+Date.now() - 604800000);
    let yesterday = new Date(+Date.now() - 172800000);
    let today = new Date(+Date.now() - 86400000);
    let all = new Date("1995-12-17T03:24:00");
    timeLineName = today;
    timeLineName = req.query.timeLine;
    if (timeLineName == 'week') {
        timeLine = week;
    } else if (timeLineName == 'yesterday') {
        timeLine = yesterday;
    } else if (timeLineName == 'all') {
        timeLine = all;
    } else {
        timeLine = today;
    }
    const payedMatch = await Bet.find({
        payed: true,
        createdAt: {
            $gt: timeLine
        }
    });
    const payedMatchLength = payedMatch.length;
    let totalpayedMoney = 0;
    let totalprizedMoney = 0;
    let totalLoseMoney = 0;
    let totalWinMoney = 0;
    let totalPendingPrizeMoney = 0;
    for (let i = 0; i < payedMatchLength; i++) {
        totalpayedMoney = totalpayedMoney + payedMatch[i].placedMoney;
        if (payedMatch[i].status == "win") {
            totalWinMoney = totalWinMoney + payedMatch[i].placedMoney;
            totalprizedMoney = totalprizedMoney + payedMatch[i].prizeMoney;
        } else if (payedMatch[i].status == 'loose') {
            totalLoseMoney = totalLoseMoney + payedMatch[i].placedMoney;
        } else {
            totalPendingPrizeMoney = totalPendingPrizeMoney + payedMatch[i].prizeMoney;
        }
    }
    const winBets = await Bet.aggregate([{
        $match: {
            status: "win",
            createdAt: {
                $gt: timeLine
            }
        },
    }, ]);
    const loseBets = await Bet.aggregate([{
        $match: {
            status: "loose",
            createdAt: {
                $gt: timeLine
            }
        },
    }, ]);
    const payedBets = await Bet.aggregate([{
        $match: {
            payed: true,
            createdAt: {
                $gt: timeLine
            }
        },
    }, ]);
    const profit = totalpayedMoney - totalprizedMoney;
    res.status(200).render('report', {
        status: "Success",
        totalPayedBets: payedBets.length,
        timeLine: timeLineName,
        payedBets,
        totalPlacedMoney: totalpayedMoney,
        totalWinBets: winBets.length,
        totalWinMoney: totalWinMoney,
        totalPrizeMoney: totalprizedMoney,
        totalLoseBets: loseBets.length,
        totalLoseMoney: totalLoseMoney,
        totalPendingMoney: totalpayedMoney - totalLoseMoney - totalWinMoney,
        totalPendingPrizeMoney: totalPendingPrizeMoney,
        winBets,
        loseBets,
        profit
    });
});
exports.registeredMatches = catchAsync(async(req, res, next) => {
    const matches = await Match.find().sort("-createdAt");
    if (!matches) {
        return next(new AppError('No Matches found', 404));
    }
    const leagues = await League.find();
    if (!leagues) {
        return next(new AppError('No leagues found', 404));
    }
    res.status(200).render('register_matches', {
        matches,
        leagues
    });
});
exports.registeredLeagues = catchAsync(async(req, res, next) => {
    const leagues = await League.find().sort("-createdAt");
    if (!leagues) {
        return next(new AppError('No leagues Found', 404));
    }
    res.status(200).render('register_leagues', {
        result: leagues.length,
        leagues
    });
});
exports.registerLeagues = catchAsync(async(req, res, next) => {
    const title = req.body.title;
    const league = await League.create({
        title: title,
    });
    leagues = await League.find().sort("-createdAt");
    if (!leagues) {
        return next(new AppError('No leagues Found', 404));
    }
    res.status(200).render('register_leagues', {
        result: leagues.length,
        leagues
    });
});
exports.viewLeagues = catchAsync(async(req, res, next) => {
    const leagues = await League.find().sort("-createdAt");
    if (!leagues) {
        return next(new AppError('No leagues Found', 404));
    }
    res.status(200).render('view_leagues', {
        result: leagues.length,
        leagues
    });
});
exports.deleteLeague = catchAsync(async(req, res, next) => {
    await Match.remove({
        leagueId: req.params.leagueId
    });
    const league = await League.findByIdAndDelete(req.params.leagueId);
    if (!league) {
        return next(new AppError("No league found with that ID", 404));
    }
    leagues = await League.find().sort("-createdAt");
    res.status(200).render('view_leagues', {
        status: "success",
        result: leagues.length,
        leagues
    });
});
exports.viewMatches = catchAsync(async(req, res, next) => {
    const leagueName = req.params.league;
    const league = await League.findOne({
        title: leagueName,
    });
    if (!league) {
        return next(new AppError("No leagues found", 404));
    }
    const leagueId = league._id;
    const matches = await Match.find({
        leagueId: leagueId,
    }).sort("-matchDetail.date");
    if (!matches) {
        return next(new AppError("No matches found", 404));
    }
    res.status(200).render('view_matches', {
        result: matches.length,
        matches,
        leagueName: leagueName,
    });
});
exports.deleteMatch = catchAsync(async(req, res, next) => {
    const matchId = req.params.matchId;
    const match = await Match.findByIdAndDelete(matchId);
    if (!match) {
        return next(new AppError("No Match Found With this id", 404));
    }
    const matches = await Match.find().sort("--matchDetail.date");
    res.status(200).render('view_matches', {
        status: "Success",
        result: matches.length,
        matches,
    });
});
deleteUnpayedBets = catchAsync(async(bets) => {
    bets = await Bet.find();
    for (let i = 0; i < bets.length; i++) {
        if (bets[i].payed == false) {
            now = Date.now();
            if (now - new Date(bets[i].createdAt) > 1200000) {
                console.log(new Date(bets[i].createdAt));
                await Bet.findByIdAndDelete(bets[i]._id);
                now = Date.now();
            }
        }
    }
});
exports.allBets = catchAsync(async(req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
    const apiFeatures = new ApiFeatures(Bet.find(), req.query).sort().search();
    const ITEMS_PER_PAGE = 15;
    const bets = await apiFeatures.query;
    Bet.find().countDocuments().then(numOfBets => {
        totalItems = numOfBets;
        return Bet.find().sort("-createdAt").skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
    }).then(bets => {
        deleteUnpayedBets();
        res.status(200).render('all_bets', {
            status: "Success",
            result: totalItems,
            bets,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    })
});
exports.payedBets = catchAsync(async(req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
    const apiFeatures = new ApiFeatures(Bet.find(), req.query).sort().search();
    const ITEMS_PER_PAGE = 15;
    await Bet.find({
        payed: true
    }).countDocuments().then(numOfBets => {
        totalItems = numOfBets;
        return Bet.find({
            payed: true
        }).sort("-createdAt").skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
    }).then(payedBets => {
        res.status(200).render('payed_bets', {
            status: "Success",
            result: payedBets.length,
            payedBets,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    })
});
exports.singleBet = catchAsync(async(req, res, next) => {
    const betId = req.params.id;
    try {
        const bet = await Bet.findOne({
            userId: new RegExp(`${betId}`, "i"),
        });
        if (!bet) {
            return next(new AppError("No bets found", 404));
        }
        res.status(200).render('single_bet', {
            status: "Success",
            bet,
        });
    } catch (err) {
        res.status(200).render('error', {
            status: "Fail",
            msg: err
        })
    }
});
exports.singleBetName = catchAsync(async(req, res, next) => {
    const betName = req.params.name;
    try {
        const bets = await Bet.find({
            userName: new RegExp(`${betName}`, "i")
        });
        if (!bets) {
            return next(new AppError("No bets found", 404));
        }
        res.status(200).render('search_name', {
            status: "Success",
            bets,
        });
    } catch (err) {
        res.status(200).render('error', {
            status: "Fail",
            msg: "Invalid Bet Id"
        })
    }
});
exports.getLeagueResults = catchAsync(async(req, res, next) => {
    const leagues = await League.find().sort("-createdAt");
    if (!leagues) {
        return next(new AppError('No leagues found', 404));
    }
    res.status(200).render('results', {
        result: leagues.length,
        leagues
    });
});
exports.matchResults = catchAsync(async(req, res, next) => {
    const leagueId = req.params.leagueId;
    const matchResults = await Result.find({
        leagueId: leagueId
    });
    res.status(200).render('match_results', {
        status: "Success",
        numOfMatches: matchResults.length,
        matchResults,
        leagueId
    });
});

exports.viewBonuses = catchAsync(async(req, res, next) => {
    // const matches = await Match.find({
    //     leagueId: leagueId,
    // }).sort("-matchDetail.date");
    // if (!matches) {
    //     return next(new AppError("No matches found", 404));
    // }
    // res.status(200).render('view_matches', {
    //     result: matches.length,
    //     matches,
    //     leagueName: leagueName,
    // });
    const bonuses = await Bonus.find({}).sort("-date");
    res.status(200).render('view_bonuses', {
        result: bonuses.length,
        bonuses
    });
});
deleteUnpayedBonusBets = catchAsync(async(bets) => {
    bets = await BonusBet.find();
    for (let i = 0; i < bets.length; i++) {
        if (bets[i].payed == false) {
            now = Date.now();
            if (now - new Date(bets[i].createdAt) > 1200000) {
                console.log(new Date(bets[i].createdAt));
                await BonusBet.findByIdAndDelete(bets[i]._id);
                now = Date.now();
            }
        }
    }
});
exports.viewBonusBets = catchAsync(async(req, res, next) => {

    const page = +req.query.page || 1;
    let totalItems;
    const apiFeatures = new ApiFeatures(BonusBet.find(), req.query).sort().search();
    const ITEMS_PER_PAGE = 20;
    const bonuses = await apiFeatures.query;
    BonusBet.find().countDocuments().then(numOfBets => {
        totalItems = numOfBets;
        return BonusBet.find().sort("-createdAt").skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
    }).then(bonuses => {
        deleteUnpayedBonusBets();
        res.status(200).render('view_bonusBets', {
            status: "Success",
            result: totalItems,
            bonuses,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    })


});