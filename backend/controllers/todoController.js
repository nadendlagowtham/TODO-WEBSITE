const Todo = require('../models/Todo');

// @desc    Get all todos for the logged-in user
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res, next) => {
  try {
    const query = { userId: req.user._id };

    // Search filter
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Status filter
    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    // Category filter
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // Priority filter
    if (req.query.priority && req.query.priority !== 'All') {
      query.priority = req.query.priority;
    }

    let todos = await Todo.find(query);

    // Apply logical sorting in-memory
    const sortBy = req.query.sort || 'Newest';
    switch (sortBy) {
      case 'Oldest':
        todos.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'DueDate':
        todos.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) {
            return new Date(b.createdAt) - new Date(a.createdAt); // Secondary sort: Newest
          }
          if (!a.dueDate) return 1; // Unscheduled tasks go to the end
          if (!b.dueDate) return -1; // Unscheduled tasks go to the end
          const diff = new Date(a.dueDate) - new Date(b.dueDate);
          if (diff !== 0) return diff;
          return new Date(b.createdAt) - new Date(a.createdAt); // Secondary sort: Newest
        });
        break;
      case 'Priority':
        const priorityWeight = { 'High': 1, 'Medium': 2, 'Low': 3 };
        todos.sort((a, b) => {
          const wA = priorityWeight[a.priority] || 2;
          const wB = priorityWeight[b.priority] || 2;
          if (wA !== wB) return wA - wB; // High first, then Medium, then Low
          return new Date(b.createdAt) - new Date(a.createdAt); // Secondary sort: Newest
        });
        break;
      case 'Newest':
      default:
        todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    res.json(todos);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single todo by ID
// @route   GET /api/todos/:id
// @access  Private
const getTodoById = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404);
      throw new Error('Todo not found');
    }

    // Check if todo belongs to user
    if (todo.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to view this todo');
    }

    res.json(todo);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res, next) => {
  try {
    const { title, description, category, priority, dueDate, status } = req.body;

    if (!title) {
      res.status(400);
      throw new Error('Please add a title');
    }

    const todo = await Todo.create({
      title,
      description,
      category: category || 'Personal',
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate,
      userId: req.user._id
    });

    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res, next) => {
  try {
    const { title, description, category, priority, status, dueDate } = req.body;
    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404);
      throw new Error('Todo not found');
    }

    // Check if todo belongs to user
    if (todo.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this todo');
    }

    // Update todo fields
    todo.title = title !== undefined ? title : todo.title;
    todo.description = description !== undefined ? description : todo.description;
    todo.category = category !== undefined ? category : todo.category;
    todo.priority = priority !== undefined ? priority : todo.priority;
    todo.status = status !== undefined ? status : todo.status;
    todo.dueDate = dueDate !== undefined ? dueDate : todo.dueDate;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404);
      throw new Error('Todo not found');
    }

    // Check if todo belongs to user
    if (todo.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this todo');
    }

    await todo.deleteOne();
    res.json({ message: 'Todo removed successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
};
