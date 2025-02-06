const Model = require("../models/curd.model");

exports.createCurd = async (req, res) => {
  try {
    const data = await Model.create(req.body);

    if (!data.description) {
      data.description = "";
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getCurds = async (req, res) => {
  try {
    const data = await Model.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteCurd = async (req, res) => {
  try {
    const data = await Model.findByIdAndDelete(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateCurd = async (req, res) => {
  try {
    const data = await Model.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
