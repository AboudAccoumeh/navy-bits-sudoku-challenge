import React from 'react';
import Timer from './Timer';
import DifficultySelect from './DifficultySelect';
import FillOptionMenu from './FillOptionMenu';

type GameMenuProps = {
	selectedValue: number;
	onSelectValue: (value: number) => void;
	selectedDifficulty: string;
	onChangeDifficulty: (difficulty: string) => void;
	timerKey: number;
	handleSolveButton: () => void;
	handleHintButton: () => void;
	handleUploadImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const GameMenu: React.FC<GameMenuProps> = ({
	selectedValue,
	onSelectValue,
	selectedDifficulty,
	onChangeDifficulty,
	timerKey,
	handleSolveButton,
	handleHintButton,
	handleUploadImage,
}) => {
	const handleUploadButton = () => {
		document.getElementById("file-input")?.click();
	};	
	return (
		<div className="game-menu">
			<Timer key={timerKey} />
			<DifficultySelect
				selectedDifficulty={selectedDifficulty}
				onChangeDifficulty={onChangeDifficulty}
			/>
			<button onClick={handleSolveButton}>Solve Puzzle</button>
			<button onClick={handleHintButton}>Hint</button>
			<input onChange={handleUploadImage} id="file-input" style={{display:"none"}} type="file" accept="image/*" />
			<button onClick={handleUploadButton}>Upload Puzzle</button>
			<FillOptionMenu
				selectedValue={selectedValue}
				onSelectValue={onSelectValue}
			/>
		</div>
	);
};

export default GameMenu;













