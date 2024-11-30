import React, { useEffect, useState } from 'react';

type TimerProps = {};

const Timer: React.FC<TimerProps> = () => {
	const [seconds, setSeconds] = useState(0);
	const [isRunning, setIsRunning] = useState(true);

	useEffect(() => {
		if (!isRunning) return;
		const interval = setInterval(() => {
			setSeconds((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [isRunning]);

	const toggleTimer = () => setIsRunning(!isRunning);
	const minutesFormat: number = Math.floor(seconds / 60);
	const secondsFormat: number = seconds % 60;
	
	const prefix = ['00', '0' , ''];
	const displayedMinutes: string = prefix[minutesFormat.toString().length] + minutesFormat.toString();
	const displayedSeconds: string = prefix[secondsFormat.toString().length] + secondsFormat.toString()
	return (
		<div className="timer">
			<h3>Timer: {displayedMinutes}:{displayedSeconds}</h3>
			<button onClick={toggleTimer}>{isRunning ? 'Pause' : 'Resume'}</button>
		</div>
	);
};

export default Timer;
