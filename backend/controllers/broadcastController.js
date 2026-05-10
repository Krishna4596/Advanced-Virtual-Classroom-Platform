const Broadcast = require("../models/Broadcast");
const { successResponse, errorResponse } = require("../utils/apiResponse");

exports.createBroadcast = async (req, res) => {
  try {
    const { classId, title, message, priority } = req.body;
    const broadcast = await Broadcast.create({
      teacher: req.user.id,
      classId,
      title,
      message,
      priority
    });
    return successResponse(res, "Broadcast Dispatched Successfully", broadcast, 201);
  } catch (err) {
    return errorResponse(res, "Dispatch Failure: " + err.message);
  }
};

exports.getClassBroadcasts = async (req, res) => {
  try {
    const { classId } = req.params;
    const broadcasts = await Broadcast.find({ classId })
      .populate("teacher", "name")
      .sort({ createdAt: -1 });
    return successResponse(res, "Broadcast History Retrieved", broadcasts);
  } catch (err) {
    return errorResponse(res, "Sync Failure");
  }
};