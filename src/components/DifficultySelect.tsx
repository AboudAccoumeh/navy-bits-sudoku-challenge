import React from 'react';

type DifficultySelectProps = {
	selectedDifficulty: string;
	onChangeDifficulty: (difficulty: string) => void;
};

const DifficultySelect: React.FC<DifficultySelectProps> = ({
	selectedDifficulty,
	onChangeDifficulty,
}) => {
	const difficulties = ['Easy', 'Medium', 'Hard', 'Custom'];

	return (
		<div className="difficulty-select">
			<label htmlFor="difficulty">Difficulty: </label>
			<select
				id="difficulty"
				value={selectedDifficulty}
				onChange={(e) => onChangeDifficulty(e.target.value)}
			>
				{difficulties.map((difficulty) => (
					<option key={difficulty} value={difficulty}>
						{difficulty}
					</option>
				))}
			</select>
		</div>
	);
};

export default DifficultySelect;
