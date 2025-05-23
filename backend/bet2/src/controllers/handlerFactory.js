const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const { promisify } = require("util");
const moment = require("moment");
const jwt = require("jsonwebtoken");
exports.deleteOne = (Model) => catchAsync(async(req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) { return next(new AppError("No document found with that ID", 404)); }
    res.status(204).json({ status: "success", data: "Null", });
});
exports.updateOne = (Model) => catchAsync(async(req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, });
    if (!doc) { return next(new AppError("No document found with that ID", 404)); }
    res.status(200).json({ status: "success", doc, });
});
exports.createOne = (Model) => catchAsync(async(req, res, next) => { req.body.createdAt = moment(Date.now()).format("dddd, MMMM D, YYYY h:mm:ss A"); const doc = await Model.create(req.body);
    res.status(201).json({ status: "success", doc, }); });
exports.getOne = (Model, popOptions) => catchAsync(async(req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) { return next(new AppError("No document found with that ID", 404)); }
    res.status(200).json({ status: "success", doc, });
});
exports.getAll = (Model) => catchAsync(async(req, res, next) => { let filter = {}; const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate(); const doc = await features.query;
    res.status(200).json({ status: "success", results: doc.length, doc, }); });