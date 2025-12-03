const BugReport = require('../models/Bug');
const {
  validateBugTitle,
  validateBugStatus,
  validateBugPriority
} = require('../utils/validator.js');

exports.createBugreport = async (req, res) => {
try{
    const { title, description, reportedBy, priority, status} = req.body;
    // validate input
    const titleValidation = validateBugTitle(title);
    const statusValidation = validateBugStatus(status);
    const priorityValidation = validateBugPriority(priority);

    if (!titleValidation.valid) {
        return res.status(400).json({ success: false, error: titleValidation.error });
    }

    if (!statusValidation.valid) {
        return res.status(400).json({ success: false, error: statusValidation.error });
    }

    if (!priorityValidation.valid) {
        return res.status(400).json({ success: false, error: priorityValidation.error });
    }
    const BugReports = await BugReport.create({
        title: titleValidation.value,
        description,
        reportedBy,
        priority: priorityValidation.value,
        status: statusValidation.value
    });
    res.status(201).json({success: true, data: BugReports});
}catch(error){
    // This catches Mongoose errors for required fields not covered by custom validation
     if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            error: messages.join(', ')
        });
    }
    res.status(500).json({ success: false, error: `Server error: ${error.message}` });
    console.error("Error creating bug report", error.message);
}
}

exports.getAllBugreports = async (req, res) => {
    try{
        const BugReports = await BugReport.find().sort({ createdAt: -1 });
        // Wrap response in the required { success: true, count, data: [] } envelope
        res.status(200).json({
          success: true,
          count: BugReports.length,
          data: BugReports
        });
    }catch(error){
        res.status(500).json({ success: false, error: error.message });
    }
}


exports.getBugReport = async (req, res) => {
    try{
        const {id} = req.params
        if (!id){
            return res.status(400).json({success: false, error: "Please provide id for BugReport"})
        }
        const bugReport = await BugReport.findById(id)

        if (!bugReport) {
            // FIX: Harmonize the error message string to "Bug not found"
            return res.status(404).json({success: false, error: "Bug not found"})
        }
        res.status(200).json({success: true, data: bugReport})

    }catch(error){
        console.error("Error getting bugReport", error.message)
        res.status(500).json({success: false, error: `Server error: ${error.message}`})
    }
}

exports.updateBugreportStatus = async (req, res) => {
    try{
        const { id } = req.params;
        const { status } = req.body;
        // check if status
        if(!status) {
            return res.status(400).json({success: false, error:"Please provide a status value for update"})
        }
        // check for valid status
         const statusValidation = validateBugStatus(req.body.status);

      if (!statusValidation.valid) {
        return res.status(400).json({
          success: false,
          error: statusValidation.error
        });
        }

        const bugReport = await BugReport.findByIdAndUpdate(
            id,
            { status: statusValidation.value },
            { new: true },
        );

        if (!bugReport) {
            return res.status(404).json({ success:false, error: "Bug not found" });
        }

        res.status(200).json({success: true, data: bugReport});
    }
    catch(error){
        res.status(500).json({ success: false, error: error.message });
    }
}


exports.deleteBugreport = async (req, res) => {
    try{
        const { id } = req.params;
        const bugReport = await BugReport.findByIdAndDelete(id);
        if (!bugReport) {
            
            return res.status(404).json({success: false, error: "Bug not found" });
        }
        
        res.status(200).json({ success: true, message: "Bug report deleted successfully." });
    }catch(error){
        res.status(500).json({ success: false, error: error.message });
    }
}