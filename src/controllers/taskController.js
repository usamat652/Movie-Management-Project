import Task from "../models/task.js";

const addTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Validate and create the task
    const task = new Task({
      title,
      description,
      status,
    });

    await task.save();

    return res.status(201).json({ message: 'Task added successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const deleteTask = async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await task.softDelete();

    const allTasks = await Task.find({});

    res.json({ message: 'Task soft-deleted successfully', allTasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { addTask, deleteTask };
