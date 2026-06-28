import API from './api';

const todoService = {
  getTodos: async (filters = {}) => {
    const response = await API.get('/todos', { params: filters });
    return response.data;
  },

  getTodoById: async (id) => {
    const response = await API.get(`/todos/${id}`);
    return response.data;
  },

  createTodo: async (todoData) => {
    const response = await API.post('/todos', todoData);
    return response.data;
  },

  updateTodo: async (id, todoData) => {
    const response = await API.put(`/todos/${id}`, todoData);
    return response.data;
  },

  deleteTodo: async (id) => {
    const response = await API.delete(`/todos/${id}`);
    return response.data;
  }
};

export default todoService;
