import React, { useState } from "react";
import { Task } from "../models/Task";
import { User } from "../models/User";

interface StatsComponentProps {
  user: User;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  fetchTasks: () => Promise<void>;
}

const API_URL = "http://localhost:8000/task";

const StatsComponent: React.FC<StatsComponentProps> = ({ user, tasks, setTasks, fetchTasks }) => {
  const [newTask, setNewTask] = useState({ title: "", description: "", date: "" });
  const [error, setError] = useState("");
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      setError("Task Name cannot be empty");
      return;
    }

    const taskToSave = { ...newTask, owner: user._id };

    try {
      const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskToSave),
      });

      if (!response.ok) throw new Error("Failed to add task");

      await fetchTasks(); // Fetch updated tasks for both Stats and Calendar
      setNewTask({ title: "", description: "", date: "" });
      setError("");
      setShowAddTaskForm(false);
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Error adding task. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${API_URL}/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId }),
      });

      if (!response.ok) throw new Error("Failed to delete task");

      await fetchTasks(); // Fetch updated tasks for both Stats and Calendar
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Error deleting task. Please try again.");
    }
  };

  return (
      <div className="stats-panel">
        {!showAddTaskForm ? (
            <>
              <h1 className="text-xl font-bold text-center mb-3">My Tasks</h1>
              {error && <p className="text-red-500 text-center">{error}</p>}

              <div className="task-list-scroll overflow-y-auto max-h-[200px] pr-1">
                <ul className="space-y-2">
                  {tasks.map((task) => (
                      <li
                          key={task._id}
                          className="flex justify-between p-2 bg-gray-100 rounded shadow"
                      >
                        <div>
                          <h2 className="font-semibold">{task.title}</h2>
                          <p className="text-sm text-gray-600">{task.description}</p>
                          <p className="text-xs text-gray-500">Due: {task.date}</p>
                        </div>
                        <button
                            className="bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600"
                            onClick={() => handleDeleteTask(task._id)}
                        >
                          Complete
                        </button>
                      </li>
                  ))}
                </ul>
              </div>

              <button
                  className="bg-orange-500 text-white w-full mt-4 py-2 rounded hover:bg-orange-600"
                  onClick={() => setShowAddTaskForm(true)}
              >
                New Task
              </button>
            </>
        ) : (
            <>
              <h2 className="text-xl font-bold mb-4 text-center">Add New Task</h2>
              {error && <p className="text-red-500 text-center">{error}</p>}

              <input
                  type="text"
                  placeholder="Task Name"
                  value={newTask.title}
                  className="w-full p-2 border rounded mb-2"
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <textarea
                  placeholder="Task Description"
                  value={newTask.description}
                  className="w-full p-2 border rounded mb-2"
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <input
                  type="date"
                  value={newTask.date}
                  className="w-full p-2 border rounded mb-4"
                  onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
              />
              <div className="flex justify-between">
                <button
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                    onClick={handleAddTask}
                >
                  Add Task
                </button>
                <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => {
                      setShowAddTaskForm(false);
                      setError("");
                    }}
                >
                  Cancel
                </button>
              </div>
            </>
        )}
      </div>
  );
};

export default StatsComponent;