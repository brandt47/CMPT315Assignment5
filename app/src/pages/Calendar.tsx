import React, { useState, useEffect } from "react";
import { User } from "../models/User";
import {
  format,
  startOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  addWeeks,
  subWeeks,
  parseISO,
} from "date-fns";
import "./styles/calendar.css";
import { Task } from "../models/Task";

interface CalendarProps {
  user: User;
  tasks: Task[];
  fetchTasks: () => Promise<void>;
}

const Calendar: React.FC<CalendarProps> = ({ user, tasks, fetchTasks }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("monthly");

  useEffect(() => {
    fetchTasks(); // Ensure tasks are refreshed
  }, [user]);

  const renderHeader = () => (
    <div>
      <div className="date-text">
        <span>{format(currentMonth, "MMMM yyyy")}</span>
      </div>
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="button-group">
            <button className="icon" onClick={prev}>
              &lt;
            </button>
            <button className="icon" onClick={goToToday}>
              Today
            </button>
          </div>
        </div>
        <div className="col col-center"></div>
        <div className="col col-end">
          <div className="button-group">
            <select onChange={(e) => setView(e.target.value)} value={view}>
              <option value="daily">Day</option>
              <option value="weekly">Week</option>
              <option value="monthly">Month</option>
            </select>
            <button className="icon" onClick={next}>
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCells = () => {
    if (view === "daily") return renderDailyCells();
    if (view === "weekly") return renderWeeklyCells();
    return renderMonthlyCells();
  };

  const renderDailyCells = () => {
    const dayTasks = tasks.filter((task) =>
      isSameDay(parseISO(task.date), selectedDate)
    );
    return (
      <div className="body daily-view">
        <div className="row">
          <div className="col cell">
            <span className="number">{format(selectedDate, "d")}</span>
            <div className="task-list">
              {dayTasks.map((task) => (
                <div key={task._id}>{task.title}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWeeklyCells = () => {
    const startDate = startOfWeek(selectedDate);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      const dayTasks = tasks.filter((task) =>
        isSameDay(parseISO(task.date), day)
      );
      days.push(
        <div
          className={`col cell ${
            isSameDay(day, selectedDate) ? "selected" : ""
          }`}
          key={day.toString()}
          onClick={() => onDateClick(day)}
        >
          <span className="number">{format(day, "d")}</span>
          <div className="task-list">
            {dayTasks.map((task) => (
              <div key={task._id}>{task.title}</div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="body weekly-view">
        <div className="row">{days}</div>
      </div>
    );
  };

  const renderMonthlyCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const rows = [];
    let days = [];
    let day = startDate;

    for (let week = 0; week < 6; week++) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayTasks = tasks.filter((task) =>
          isSameDay(parseISO(task.date), day)
        );
        days.push(
          <div
            className={`col cell ${
              !isSameMonth(day, monthStart)
                ? "disabled"
                : isSameDay(day, selectedDate)
                ? "selected"
                : ""
            }`}
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="number">{format(day, "d")}</span>
            <div className="task-list">
              {dayTasks.map((task) => (
                <div key={task._id}>{task.title}</div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body monthly-view">{rows}</div>;
  };

  const onDateClick = (day: Date) => setSelectedDate(day);

  const next = () => {
    setCurrentMonth(
      view === "monthly" ? addMonths(currentMonth, 1) : selectedDate
    );
    setSelectedDate(
      view === "weekly" ? addWeeks(selectedDate, 1) : addDays(selectedDate, 1)
    );
  };

  const prev = () => {
    setCurrentMonth(
      view === "monthly" ? addMonths(currentMonth, -1) : selectedDate
    );
    setSelectedDate(
      view === "weekly" ? subWeeks(selectedDate, 1) : addDays(selectedDate, -1)
    );
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  return (
    <div className="calendar-container">
      <div className="calendar">
        {renderHeader()}
        {renderCells()}
      </div>
    </div>
  );
};

export default Calendar;
