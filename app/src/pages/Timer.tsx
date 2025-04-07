import React, { useState, useEffect } from 'react';
import './styles/Timer.css';

const Timer: React.FC = () => {
    const [time, setTime] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isBreakMode, setIsBreakMode] = useState(false);
    const [cycles, setCycles] = useState(0);

    const [workDuration, setWorkDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [totalCycles, setTotalCycles] = useState(4);

    // Format time as mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Start or pause the timer
    const handleStartPause = () => {
        setIsRunning(!isRunning);
    };

    // Reset timer to default state
    const handleReset = () => {
        setIsRunning(false);
        setIsBreakMode(false);
        setCycles(0);
        setTime(workDuration * 60);
    };

    // Countdown logic
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning) {
            interval = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime === 0) {
                        if (!isBreakMode) {
                            // Start break
                            setIsBreakMode(true);
                            return breakDuration * 60;
                        } else {
                            // End break and continue to next cycle
                            const nextCycle = cycles + 1;
                            if (nextCycle >= totalCycles) {
                                handleReset();
                                return 0;
                            } else {
                                setCycles(nextCycle);
                                setIsBreakMode(false);
                                return workDuration * 60;
                            }
                        }
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning, isBreakMode, cycles, workDuration, breakDuration, totalCycles]);

    // Reset timer duration if workDuration changes while paused
    useEffect(() => {
        if (!isRunning) {
            setTime(workDuration * 60);
        }
    }, [workDuration]);

    return (
        <div className="timer-container">
            <h2 className="timer-title">Pomodoro Timer</h2>

            <div
                className={`timer-display ${
                    isRunning
                        ? isBreakMode
                            ? "break-mode"
                            : "work-mode"
                        : "reset-mode"
                }`}
            >
                {formatTime(time)}
            </div>

            <div className="timer-controls">
                <button className="timer-btn" onClick={handleStartPause}>
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                <button className="timer-btn" onClick={handleReset}>Reset</button>
            </div>

            <div className="timer-settings">
                <div className="setting-group">
                    <label>Work</label>
                    <input
                        type="number"
                        value={workDuration}
                        onChange={(e) => setWorkDuration(Number(e.target.value))}
                        min={1}
                    />
                </div>
                <div className="setting-group">
                    <label>Break</label>
                    <input
                        type="number"
                        value={breakDuration}
                        onChange={(e) => setBreakDuration(Number(e.target.value))}
                        min={1}
                    />
                </div>
                <div className="setting-group">
                    <label>Cycles</label>
                    <input
                        type="number"
                        value={totalCycles}
                        onChange={(e) => setTotalCycles(Number(e.target.value))}
                        min={1}
                    />
                </div>
            </div>

            <div className="cycle-info">
                <p>Cycle: {cycles} / {totalCycles}</p>
            </div>
        </div>
    );
};

export default Timer;
