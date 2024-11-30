import React from 'react';
import Cell from './Cell';

type RegionProps = {
	regionIndex: number;
	board: number[][];
	isClue: boolean[][];
	updateCell: (row: number, col: number, value: number) => void;
	selectedValue:number;
	conflicts: number[];
	playPlaceNumberSound: () => void;
	playRemoveNumberSound:() => void;
};

function Region({ regionIndex, board, isClue, updateCell, selectedValue, conflicts, playPlaceNumberSound, playRemoveNumberSound }: RegionProps) {
	const regionStartRow = Math.floor(regionIndex / 3) * 3;
	const regionStartCol = (regionIndex % 3) * 3;

	return (
		<div className="region">
			{Array.from({ length: 9 }, (_, cellIndex) => {
				const row = regionStartRow + Math.floor(cellIndex / 3);
				const col = regionStartCol + (cellIndex % 3);
				return (
					<Cell
						key={cellIndex}
						row={row}
						col={col}
						value={board[row][col]}
						isClue={isClue[row][col]}
						updateCell={updateCell}
						selectedValue={selectedValue}
						conflicts={conflicts}
						playPlaceNumberSound={playPlaceNumberSound}
						playRemoveNumberSound={playRemoveNumberSound}
					/>
				);
			})}
		</div>
	);
}

export default Region;
