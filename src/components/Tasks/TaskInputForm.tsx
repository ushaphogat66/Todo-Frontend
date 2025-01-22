import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BsBell, BsBellFill } from "react-icons/bs";
import { TbRepeat, TbRepeatOff } from "react-icons/tb";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CiCalendar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";

interface TaskInputFormProps {
  themeProperties: any;
  handleAddTask: (newTask: any) => void;
}

const TaskInputForm: React.FC<TaskInputFormProps> = ({
  themeProperties,
  handleAddTask,
}) => {
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [reminder, setReminder] = useState("No reminder");
  const [repeat, setRepeat] = useState(false);
  const [priority, setPriority] = useState("low");
  const [favorite, setFavorite] = useState(false);
  const [dueDate, setDueDate] = useState(new Date().toISOString());

  const onAddTask = () => {
    const newTask = {
      title: newTaskTitle,
      description: newTaskText,
      reminder: reminder,
      repeat: repeat,
      priority: priority,
      favorite: favorite,
      completed: false,
      dueDate: dueDate,
    };
    handleAddTask(newTask);
    setNewTaskText("");
    setNewTaskTitle("");
  };

  return (
    <div
      className="flex flex-col justify-between p-4 border rounded-md shadow-sm"
      style={{ backgroundColor: themeProperties.primaryColor }}
    >
      <div className="w-full  "
      
      >
          <div className=" flex justify-between items-center  border-b-2"
          style={{ borderColor: themeProperties?.specialText }}
          
          >
          <input
          type="text"
          placeholder="Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className={`w-full outline-none p-2 bg-transparent focus:outline-none${
            themeProperties.textColor === "#000000"
              ? " placeholder:text-black "
              : "placeholder:text-white"
          }`}
        />
        {
          favorite ? (
            <button onClick={() => setFavorite(false)}>
              <FaStar size={23} color={themeProperties.textColor} />
            </button>
          ) : (
            <button onClick={() => setFavorite(true)}>
              <CiStar size={23} color={themeProperties.textColor} />
            </button>
          )
        }
          </div>

        <textarea
          wrap="hard"
          placeholder="Add a new task"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          className={`first-letter:capitalize resize-none w-full p-2 h-32 bg-transparent focus:outline-none ${
            themeProperties.textColor === "#000000"
              ? " placeholder:text-black"
              : "placeholder:text-white"
          }`}
        />
      </div>
      <div className="flex  md:flex-row flex-col justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <button title="Reminder" className="cursor-pointer">
            {reminder != "No Reminder"? (
              <BsBell
                size={20}
                color={themeProperties.iconColor}
                onClick={() => setReminder("No Reminder")}
              />
            ) : (
              <BsBellFill
                size={20}
                color={themeProperties.iconColor}
                onClick={() => setReminder("Reminder on")}
              />
            )}
          </button>
          <button
            title="Repeat"
            onClick={() => setRepeat(!repeat)}
            className="cursor-pointer"
          >
            {!repeat ? (
              <TbRepeat
                size={20}
                className="cursor-pointer"
                color={themeProperties.iconColor}
              />
            ) : (
              <TbRepeatOff
                size={20}
                className="cursor-pointer"
                color={themeProperties.iconColor}
              />
            )}
          </button>

          <Popover>
            <PopoverTrigger className=" flex items-center gap-2 justify-center">
              <p className=" text-[12px]  text-nowrap">{dueDate.split("T")[0]}</p>
              <CiCalendar size={23} color={themeProperties.iconColor} />
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={new Date(dueDate)}
                onSelect={(date: any) => {
                  if (date) {
                    const localDate = new Date(
                      date.getTime() - date.getTimezoneOffset() * 60000
                    );
                    setDueDate(localDate.toISOString());
               }
                }}
              />
            </PopoverContent>
          </Popover>

          <Select onValueChange={(value) => setPriority(value)}>
            <SelectTrigger className="w-28 text-sm shadow-none"
              style={{
                backgroundColor: themeProperties.secondaryColor,
                color: themeProperties.specialText,}
              }
            >
              <SelectValue className=" " placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Priority</SelectLabel>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="text-sm uppercase"
          style={{
            backgroundColor: themeProperties.secondaryColor,
            color: themeProperties.specialText,
          }}
          onClick={onAddTask}
          disabled={!newTaskText || !newTaskTitle}
        >
          Add Task
        </Button>
      </div>
    </div>
  );
};

export default TaskInputForm;
