
"use client"
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../utils/apiUrl';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  priority: string;
  dueDate: Date;
  repeat: boolean;
  favorite: boolean;
  reminder: string;
  completed: boolean;
  text : string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

// Fetch tasks thunk
export const fetchTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }): Promise<Task[] | ReturnType<typeof rejectWithValue>> => {
    try {
      const response = await axios.get<Task[]>(`${API_URL}/tasks`,
         {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      toast.error('Failed to fetch tasks', { description: error.response?.data?.message || 'Failed to fetch tasks' });
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

// Create task thunk
export const createTask = createAsyncThunk<Task, { title: string; priority: string; dueDate: Date;   repeat : boolean; reminder : string; favorite : boolean; text : string  }, { rejectValue: string }>(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    toast.info('Creating your task...');
    try {
      const response = await axios.post<Task>(`${API_URL}/tasks`, taskData , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success('Task created successfully');

      

      return response.data;
    } catch (error: any) {
      toast.error('Failed to create task', { description: error.response?.data?.message || 'Failed to create task' });
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk<Task, { id: string; taskData: { title: string; priority: string; dueDate: Date; repeat : boolean; reminder : string; favorite : boolean; completed: boolean } }, { rejectValue: string }>(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    toast.info('Updating your task...');
    try {
      const response = await axios.put<Task>(`${API_URL}/tasks/${id}`, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Task updated successfully');
      return response.data;
    } catch (error: any) {
      toast.error('Failed to update task', { description: error.response?.data?.message || 'Failed to update task' });
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

// Delete task thunk
export const deleteTask = createAsyncThunk<string, string, { rejectValue: string }>(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    toast.info('Deleting the task...');
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Task deleted successfully');
      return id;
    } catch (error: any) {
      toast.error('Failed to delete task', { description: error.response?.data?.message || 'Failed to delete task' });
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
    }
  }
);

// Load tasks from localStorage
export const loadTasksFromLocalStorage = createAsyncThunk<Task[]>(
  'tasks/loadTasksFromLocalStorage',
  async () => {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || null;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || null;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || null;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(loadTasksFromLocalStorage.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.tasks = action.payload;
      });
  },
});

// Save tasks to localStorage whenever tasks state changes
export const saveTasksToLocalStorage = (tasks: Task[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

export default taskSlice.reducer;