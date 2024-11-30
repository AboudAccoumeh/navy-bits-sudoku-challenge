import React from 'react';

type CellProps = {
	row: number;
	col: number;
	value: number;
	isClue: boolean;
	updateCell: (row: number, col: number, value: number) => void;
	selectedValue: number;
	conflicts: number[];
	playPlaceNumberSound: () => void;
	playRemoveNumberSound:() => void;
};

function Cell({ row, col, value, isClue, updateCell, selectedValue, conflicts,playPlaceNumberSound, playRemoveNumberSound}: CellProps) {
	const handleClick = () => {
		if(isClue){return}
		updateCell(row, col, selectedValue);
		selectedValue==0 ? playRemoveNumberSound() : playPlaceNumberSound();
	};
	const handleRightClick = (e: React.MouseEvent) => {
		e.preventDefault();
		if(isClue){return}
		updateCell(row, col, 0);
		playRemoveNumberSound();
	};
	const cellIndex = row * 9 + col;
	const wrongClass: string = conflicts.includes(cellIndex) ? "wrong" : "";
	const clueClass: string = isClue ? "clue" : "";
	return (
		<div className={`cell ${wrongClass} ${clueClass}`} onClick={handleClick} onContextMenu={handleRightClick}>
			{value !== 0 ? value : ''}
		</div>
	);
}

export default Cell;
