/**
 * ============================================================
 * 📊 TITAN NEURAL POLL CONTROLLER (v4.2 - Production)
 * Ref: Report Section 1.3 (Real-time Handshaking)
 * ============================================================
 */
const Poll = require("../models/Poll");

// ================= 📝 1. CREATE POLL (Teacher Node) =================
exports.createPoll = async (req, res) => {
  try {
    const { classId, question, options } = req.body;

    if (!question || !options || options.length < 2) {
      return res.status(400).json({ success: false, message: "Invalid Poll Data" });
    }

    // 🛡️ Existing active polls ko close karna zaroori hai
    await Poll.updateMany({ classId, active: true }, { active: false });

    const formattedOptions = options.map(opt => ({
      text: opt, 
      votes: 0
    }));

    const poll = await Poll.create({
      classId,
      question,
      options: formattedOptions,
      creator: req.user.id, 
      active: true,
      voters: [] 
    });

    const io = req.app.get("io");
    if (io) io.to(classId).emit("new_poll_created", poll);

    res.status(201).json({ success: true, data: poll });
  } catch (err) {
    console.error("POLL_DEPLOY_CRASH:", err);
    res.status(500).json({ success: false, message: "Poll Deployment Failure" });
  }
};

// ================= 🛰️ 2. GET ACTIVE POLL (Sync Handshake) =================
// ⚠️ Ye function missing tha, isliye crash ho raha tha
exports.getActivePoll = async (req, res) => {
  try {
    const { classId } = req.params;
    const poll = await Poll.findOne({ classId, active: true }).sort({ createdAt: -1 });
    
    return res.json({ success: true, data: poll || null });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Telemetry Fetch Failure" });
  }
};

// ================= ✅ 3. CAST VOTE (Student Handshake) =================
exports.castVote = async (req, res) => {
  try {
    const { pollId, optionIndex } = req.body;
    const userId = req.user.id;

    const poll = await Poll.findById(pollId);
    if (!poll || !poll.active) return res.status(404).json({ success: false, message: "Poll offline" });

    if (poll.voters.includes(userId)) {
      return res.status(400).json({ success: false, message: "Node already voted" });
    }

    // 🚀 ATOMIC UPDATE
    poll.options[optionIndex].votes += 1;
    poll.voters.push(userId);
    await poll.save();

    const io = req.app.get("io");
    if (io) io.to(poll.classId.toString()).emit("poll_updated", poll);

    res.json({ success: true, data: poll });
  } catch (err) {
    res.status(500).json({ success: false, message: "Voting Handshake Failed" });
  }
};