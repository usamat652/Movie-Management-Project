import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "fail"],
    default: "pending",
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

// Create a virtual property to check if the task is deleted
taskSchema.virtual('isDeleted').get(function() {
  return this.deletedAt !== null;
});

taskSchema.methods.softDelete = function() {
  this.deletedAt = new Date();
  return this.save();
};

const Task = mongoose.model("Task", taskSchema);
export default Task