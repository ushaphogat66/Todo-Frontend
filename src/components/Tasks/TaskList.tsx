import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: any[];
  themeProperties: any;
  handleToggleCompletion: (id: string) => void;
  handleToggleFavourite: (id: string) => void;
  selectedTask: any;
  setSelectedTask: (task: any) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, themeProperties, handleToggleCompletion, handleToggleFavourite, selectedTask, setSelectedTask  }) => {
  return (
    <div className="space-y-2 mt-6 overflow-scroll ">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          themeProperties={themeProperties}
          handleToggleCompletion={handleToggleCompletion}
          handleToggleFavourite={handleToggleFavourite}
          selectedTask = {selectedTask}
          setSelectedTask = {setSelectedTask}
        />
      ))}
    </div>
  );
};

export default TaskList;