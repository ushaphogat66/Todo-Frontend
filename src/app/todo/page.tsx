"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectThemeProperties } from "@/features/theme/theme";
import { RootState } from "./store";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/features/tasks/tasks";
import { AppDispatch } from "./store";
import TaskInputForm from "@/components/Tasks/TaskInputForm";
import TaskList from "@/components/Tasks/TaskList";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BsBell, BsBellFill } from "react-icons/bs";
import { TbRepeat, TbRepeatOff } from "react-icons/tb";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area"

import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { formatDistanceToNow } from "date-fns";

const TasksPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const user: any | null =
    useSelector((state: RootState) => state?.auth?.user) || null;
  const tasks = useSelector((state: RootState) => state.tasks?.tasks) || [];
  const themeProperties = useSelector((state: RootState) =>
    selectThemeProperties(state)
  );
  const [mytasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchTasks()).then((data) => {
        if (data.payload) {
          setTasks(data.payload as any[]);
        }
      });
    } else  if (typeof window !== "undefined") {
      const localTasks = localStorage.getItem("tasks");
      if (localTasks) {
        setTasks(JSON.parse(localTasks));
      }
    }
  }, [user, dispatch]);



  const handleAddTask = (newTask: any) => {
    if (user) {
      dispatch(createTask(newTask)).then((data) => {
        if (data.payload) {
          setTasks((prevTasks) => [...prevTasks, data.payload]);
        }
      });
    } else {
      newTask.id = Math.random().toString(36).substr(2, 9);
      newTask.createdAt = new Date().toISOString();
      newTask.updatedAt = new Date().toISOString();
      

      if (typeof window !== "undefined") {
        localStorage.setItem("tasks", JSON.stringify([...mytasks, newTask]));
      }
    
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }
  };

  const handleToggleCompletion = (id: string) => {
    if (user) {
      const task = tasks.find((task) => task?.id === id);
      if (task) {
        dispatch(
          updateTask({
            id: task.id,
            taskData: { ...task, completed: !task.completed },
          })
        ).then(() => {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === id
                ? { ...task, completed: !task.completed, updatedAt: new Date() }
                : task
            )
          );

          if (selectedTask) {
            setSelectedTask({
              ...selectedTask,
              completed: !selectedTask.completed,
            });
          }
        });
      }
    } else {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    }
  };

  const handleToggleFavourite = (id: string) => {
    if (user) {
      const task = tasks.find((task) => task?.id === id);
      if (task) {
        dispatch(
          updateTask({
            id: task.id,
            taskData: { ...task, favorite: !task.favorite },
          })
        ).then(() => {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === id ? { ...task, favorite: !task.favorite } : task
            )
          );

          if (selectedTask) {
            setSelectedTask({
              ...selectedTask,
              favorite: !selectedTask.favorite,
            });
          }
        });
      }
    } else {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, favorite: !task.favorite } : task
        )
      );
    }
  };

  const handleDeleteTask = (id: string) => {
    if (user) {
      dispatch(deleteTask(id)).then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        setSelectedTask(null);
      });
    } else {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    }
  };

  const handleUpdateTask = (updatedTask: any) => {
    if (user) {
      dispatch(updateTask({ id: updatedTask.id, taskData: updatedTask })).then(
        () => {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            )
          );
        }
      );
    } else {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    }
  };


  const completedTasks = mytasks.filter((task) => task?.completed);
  const notCompletedTasks = mytasks.filter((task) => !task?.completed);

  return (
    <div className="h-full p-4 w-full overflow-hidden ">
      <div className="w-full mx-auto rounded-lg p-4">
        <h1
          className="text-xl font mb-4"
          style={{ color: themeProperties.specialText }}
        >
          To Do
        </h1>
        <TaskInputForm
          themeProperties={themeProperties}
          handleAddTask={handleAddTask}
        />
        <div className=" h-[50vh] overflow-scroll custom-scrollbar">
          {mytasks.length > 0 ? (
            <>
              <TaskList
                tasks={notCompletedTasks}
                themeProperties={themeProperties}
                handleToggleCompletion={handleToggleCompletion}
                handleToggleFavourite={handleToggleFavourite}
                selectedTask={selectedTask}
                setSelectedTask={setSelectedTask}
              />
              <h2 className="text-sm mt-6">Completed</h2>
              <TaskList
                tasks={completedTasks}
                themeProperties={themeProperties}
                handleToggleCompletion={handleToggleCompletion}
                handleToggleFavourite={handleToggleFavourite}
                selectedTask={selectedTask}
                setSelectedTask={setSelectedTask}
              />
            </>
          ) : (
            <div className="text-center text-sm mt-4">No Tasks, create a new task.</div>
          )}
        </div>
      </div>
      {selectedTask && (
        <Sheet
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
        >
          <SheetContent
            className="p-4 rounded-lg shadow-lg w-full"
            style={{
              color: themeProperties.textColor,
              backgroundColor: themeProperties.backgroundBox,
            }}
          >
            <SheetHeader>
              <SheetTitle></SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <div className=" p-10">
              <div
                className="flex items-center gap-4 border-y-2 p-4"
                style={{
                  borderColor: themeProperties.primaryColor,
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedTask?.completed}
                  onChange={() => handleToggleCompletion(selectedTask?.id)}
                  className="w-4 h-4 custom-checkbox text-green-600 border-gray-300 rounded cursor-pointer"
                />
                <span
                  className={`text-sm cursor-pointer ${
                    selectedTask?.completed ? " " : ""
                  }`}
                >
                  {selectedTask?.title}
                </span>
              </div>
              <div
                className="flex items-center gap-4 border-b-2 p-4"
                style={{
                  borderColor: themeProperties.primaryColor,
                }}
              >
                <div
                  className="flex items-center gap-2 cursor-pointer
                "
                  onClick={() => handleToggleFavourite(selectedTask?.id)}
                >
                  {selectedTask?.favorite ? (
                    <FaStar size={20} color={themeProperties.textColor} />
                  ) : (
                    <CiStar size={23} color={themeProperties.textColor} />
                  )}
                  <span className="text-sm ">
                    {selectedTask?.favorite ? "Favourite" : "Add to Favourite"}
                  </span>
                </div>
              </div>
              <div
                className="flex items-center gap-4 border-b-2 p-4"
                style={{
                  borderColor: themeProperties.primaryColor,
                }}
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <CiCalendar size={20} color={themeProperties.textColor} />
                  <span className="text-sm">
                    Due -{" "}
                    {selectedTask?.dueDate
                      ? formatDistanceToNow(new Date(selectedTask?.dueDate), {
                          addSuffix: true,
                        })
                      : "No Due Date"}
                  </span>
                </div>
              </div>

              <div
                className="flex items-center gap-4 border-b-2 p-4"
                style={{
                  borderColor: themeProperties.primaryColor,
                }}
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <BsBell size={20} color={themeProperties.textColor} />
                  <span className="text-sm">
                    {selectedTask?.reminder ? "Reminder Set" : "No Reminder"}
                  </span>
                </div>
              </div>

              <div
                className="flex items-center gap-4 border-b-2 p-4"
                style={{
                  borderColor: themeProperties.primaryColor,
                }}
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <TbRepeat size={20} color={themeProperties.textColor} />
                  <span className="text-sm ">
                    {selectedTask?.repeat ? "Repeat Set" : "No Repeat"}
                  </span>
                </div>
              </div>
            </div>

            <div
              className=" p-10 border-t-2"
              style={{ borderColor: themeProperties.primaryColor }}
            >
              <div className="text-sm">Note - </div>
              <div className="text-sm ">{selectedTask?.description}</div>
            </div>

            <div
              className=" absolute bottom-4 flex justify-between w-full border-t-2 pt-4"
              style={{
                borderColor: themeProperties.specialText,
              }}
            >
              <SheetClose>
                <IoCloseSharp size={25} />
              </SheetClose>
              <p className=" text-sm text-gray-400" style={{}}>
                Created{" "}
                {formatDistanceToNow(new Date(selectedTask.createdAt), {
                  addSuffix: true,
                })}
              </p>
              <button
                onClick={() => handleDeleteTask(selectedTask?.id)}
                className=""
              >
                <MdDelete size={25} className=" -translate-x-5" />
              </button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default TasksPage;
