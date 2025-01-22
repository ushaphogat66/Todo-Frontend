import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { formatDistanceToNow } from 'date-fns';

interface TaskItemProps {
  task: any;
  themeProperties: any;
  handleToggleCompletion: (id: string) => void;
  handleToggleFavourite: (id: string) => void;
     selectedTask: any;
     setSelectedTask: (task: any) => void;

}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  themeProperties,
  handleToggleCompletion,
  handleToggleFavourite,
  selectedTask, setSelectedTask
}) => {
  return (
    <div
      className={`flex items-center justify-between p-6 ${
        themeProperties.textColor == "#000000" ? "" : " border-gray-500"
      } border-b-2`}
    >
      <div className="flex items-center  justify-between w-full space-x-2 pr-4">
      <div className="flex items-center gap-4">
      <input
          type="checkbox"
          checked={task?.completed}
          onChange={() => handleToggleCompletion(task?.id)}
          className="w-4 h-4 custom-checkbox text-green-600 border-gray-300 rounded cursor-pointer"
        />
        <span
          onClick={() => setSelectedTask(task)}
          className={`text-sm cursor-pointer ${
            task?.completed ? "line-through text-gray-400" : ""
          }`}
        >
          {task?.title}
        </span>

      </div>
        <div>
          <div className="md:text-sm text-gray-500 text-nowrap text-[12px]">Due - { task?.dueDate ? formatDistanceToNow(new Date(task?.dueDate), { addSuffix: true }) : "No Due Date" }
          </div>
          <div className="md:text-sm text-gray-500 text-[12px]">{task?.reminder}</div>
        </div>
      </div>

      <button
        onClick={() => handleToggleFavourite(task.id)}
        className={`text-lg`}
      >
        {task?.favorite ? <FaStar size={23} /> : <CiStar size={23} />}
      </button>
    </div>
  );
};

export default TaskItem;
