import React from 'react';
import Region from './Region';

type Board = number[][];

type SudokuGridProps = {
	board: Board;
	isClue: boolean[][];
	updateCell: (row: number, col: number, value: number) => void;
	selectedValue: number;
	conflicts: number[];
	playPlaceNumberSound: () => void;
	playRemoveNumberSound:() => void;
};

function SudokuGrid({ board, isClue, updateCell, selectedValue, conflicts, playPlaceNumberSound, playRemoveNumberSound }: SudokuGridProps) {
	return (
		<div className="sudokuGrid">
			{Array.from({ length: 9 }, (_, regionIndex) => (
				<Region
					key={regionIndex}
					regionIndex={regionIndex}
					board={board}
					isClue={isClue}
					updateCell={updateCell}
					selectedValue={selectedValue}
					conflicts={conflicts}
					playPlaceNumberSound={playPlaceNumberSound}
					playRemoveNumberSound={playRemoveNumberSound}
				/>
			))}
		</div>
	);
}

export default SudokuGrid;
