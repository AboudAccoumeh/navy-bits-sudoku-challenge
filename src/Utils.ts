export const checkConflicts = (board: number[][]): number[] => {
  const conflicts = new Set<number>(); // Set to store unique conflict cell indices

  // Check rows for duplicates
  board.forEach((row, rowIndex) => {
    const seen = new Map<number, number>(); // Store the index of seen values to track conflicts
    row.forEach((value, colIndex) => {
      if (value !== 0) {
        const cellIndex = rowIndex * board.length + colIndex; // Convert (row, col) to 1D index
        if (seen.has(value)) {
          const prevIndex = seen.get(value);
          if (prevIndex !== undefined) {
            conflicts.add(prevIndex); // Add the first conflict cell index
          }
          conflicts.add(cellIndex); // Add the current conflict cell index
        } else {
          seen.set(value, cellIndex); // Store the index of the current value
        }
      }
    });
  });

  // Check columns for duplicates
  for (let col = 0; col < board.length; col++) {
    const seen = new Map<number, number>(); // Store the index of seen values to track conflicts
    for (let row = 0; row < board.length; row++) {
      const value = board[row][col];
      if (value !== 0) {
        const cellIndex = row * board.length + col; // Convert (row, col) to 1D index
        if (seen.has(value)) {
          const prevIndex = seen.get(value);
          if (prevIndex !== undefined) {
            conflicts.add(prevIndex); // Add the first conflict cell index
          }
          conflicts.add(cellIndex); // Add the current conflict cell index
        } else {
          seen.set(value, cellIndex); // Store the index of the current value
        }
      }
    }
  }

  // Check 3x3 regions for duplicates
  for (let regionRow = 0; regionRow < 3; regionRow++) {
    for (let regionCol = 0; regionCol < 3; regionCol++) {
      const seen = new Map<number, number>(); // Store the index of seen values to track conflicts
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const value = board[regionRow * 3 + row][regionCol * 3 + col];
          if (value !== 0) {
            const cellIndex = (regionRow * 3 + row) * board.length + (regionCol * 3 + col); // Convert (row, col) to 1D index
            if (seen.has(value)) {
              const prevIndex = seen.get(value);
              if (prevIndex !== undefined) {
                conflicts.add(prevIndex); // Add the first conflict cell index
              }
              conflicts.add(cellIndex); // Add the current conflict cell index
            } else {
              seen.set(value, cellIndex); // Store the index of the current value
            }
          }
        }
      }
    }
  }

  return Array.from(conflicts); // Convert Set to array and return it
};









function getRandomBoard(): number[][]{
	function shuffle(sudoku: number[][]): number[][] {
		// Step 2: Shuffle digits and replace them in all cells
		const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		const shuffledDigits = digits.sort(() => Math.random() - 0.5); // Shuffle the digits
		const digitMap = new Map<number, number>();
		digits.forEach((digit, index) => digitMap.set(digit, shuffledDigits[index]));

		sudoku = sudoku.map(row => row.map(cell => digitMap.get(cell)!));

		// Utility function to shuffle groups within specified indices
		function shuffleGroups(grid: number[][], groupSize: number, isColumn: boolean = false) {
			for (let group = 0; group < grid.length; group += groupSize) {
				const groupIndices = Array.from(
					{ length: groupSize },
					(_, i) => group + i
				);
				const shuffledIndices = groupIndices.sort(() => Math.random() - 0.5);

				if (isColumn) {
					// Shuffle columns
					for (let row = 0; row < grid.length; row++) {
						const temp = groupIndices.map(i => grid[row][i]);
						shuffledIndices.forEach((shuffledIndex, i) => {
							grid[row][group + i] = temp[i];
						});
					}
				} else {
					// Shuffle rows
					const temp = groupIndices.map(i => grid[i]);
					shuffledIndices.forEach((shuffledIndex, i) => {
						grid[group + i] = temp[i];
					});
				}
			}
			return grid;
		}

		// Steps 3-5: Shuffle columns within their respective groups
		sudoku = shuffleGroups(sudoku, 3, true);

		// Steps 6-8: Shuffle rows within their respective groups
		sudoku = shuffleGroups(sudoku, 3, false);

		// Step 9: Randomly rearrange the 3 column groups of size 9x3
		const columnGroups = [0, 3, 6];
		const shuffledColumnGroups = columnGroups.sort(() => Math.random() - 0.5);
		for (let row = 0; row < sudoku.length; row++) {
			const temp = columnGroups.map(group => sudoku[row].slice(group, group + 3));
			shuffledColumnGroups.forEach((group, i) => {
				sudoku[row].splice(columnGroups[i], 3, ...temp[group / 3]);
			});
		}

		// Step 10: Randomly rearrange the 3 row groups of size 3x9
		const rowGroups = [0, 3, 6];
		const shuffledRowGroups = rowGroups.sort(() => Math.random() - 0.5);
		const tempRows = rowGroups.map(group => sudoku.slice(group, group + 3));
		shuffledRowGroups.forEach((group, i) => {
			sudoku.splice(rowGroups[i], 3, ...tempRows[group / 3]);
		});

		return sudoku;
	}

	// Initial Sudoku grid
	let sudoku: number[][] = [
		[1, 2, 3, 4, 5, 6, 7, 8, 9],
		[4, 5, 6, 7, 8, 9, 1, 2, 3],
		[7, 8, 9, 1, 2, 3, 4, 5, 6],
		[2, 3, 1, 5, 6, 4, 8, 9, 7],
		[5, 6, 4, 8, 9, 7, 2, 3, 1],
		[8, 9, 7, 2, 3, 1, 5, 6, 4],
		[3, 1, 2, 6, 4, 5, 9, 7, 8],
		[6, 4, 5, 9, 7, 8, 3, 1, 2],
		[9, 7, 8, 3, 1, 2, 6, 4, 5],
	];

	// Shuffle and print the result
	return shuffle(sudoku);
}



function solveOrCountSudoku(sudoku: number[][], stopAtFirst: boolean = true): number {
	let solutionCount = 0;

	// Utility function to check if a number is valid in a specific cell
	function isValid(sudoku: number[][], row: number, col: number, num: number): boolean {
		for (let x = 0; x < 9; x++) {
			if (sudoku[row][x] === num || sudoku[x][col] === num) {
				return false;
			}
		}
		const startRow = Math.floor(row / 3) * 3;
		const startCol = Math.floor(col / 3) * 3;
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (sudoku[startRow + i][startCol + j] === num) {
					return false;
				}
			}
		}
		return true;
	}

	// Find the next empty cell
	function findEmpty(sudoku: number[][]): [number, number] | null {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				if (sudoku[row][col] === 0) {
					return [row, col];
				}
			}
		}
		return null;
	}

	// Recursive function to solve or count
	function backtrack(sudoku: number[][]): boolean {
		const emptyCell = findEmpty(sudoku);
		if (!emptyCell) {
			solutionCount++;
			return stopAtFirst; // Stop if solving for a single solution
		}

		const [row, col] = emptyCell;

		for (let num = 1; num <= 9; num++) {
			if (isValid(sudoku, row, col, num)) {
				sudoku[row][col] = num;

				if (backtrack(sudoku)) {
					return true; // Stop if solving for a single solution
				}

				sudoku[row][col] = 0; // Backtrack
			}
		}
		return false;
	}

	backtrack(sudoku);
	return solutionCount;
}

// Example Usage:

// Solve the puzzle (find one solution)
export function solveSudoku(sudoku: number[][]): boolean {
	return solveOrCountSudoku(sudoku, true) > 0;
}

// Count all solutions
function countSudokuSolutions(sudoku: number[][]): number {
	return solveOrCountSudoku(sudoku, false);
}


export function generateUniqueSudoku(k: number): number[][] {
	console.log("generating");
	// Start with a shuffled, valid Sudoku grid
	const shuffledBoard = getRandomBoard();

	// Deep copy the shuffled board to create the puzzle
	let puzzle: number[][] = shuffledBoard.map(row => [...row]);

	// Track the positions already attempted for removal
	const attemptedPositions = new Set<number>();
	let removedClues = 0;

	while (removedClues < k) {
		// Pick a random position (0-80)
		const pos = Math.floor(Math.random() * 81);

		// Ensure we don't attempt the same position multiple times
		if (attemptedPositions.has(pos)) continue;
		attemptedPositions.add(pos);

		const row = Math.floor(pos / 9);
		const col = pos % 9;

		// Temporarily remove the number
		const backup = puzzle[row][col];
		puzzle[row][col] = 0;

		// Check if the puzzle still has a unique solution
		if (countSudokuSolutions(puzzle) !== 1) {
			// Restore the number if the solution is no longer unique
			puzzle[row][col] = backup;
		} else {
			// Successfully removed a clue
			removedClues++;
		}
	}

	return puzzle;
}

// Helper function to shuffle an array
function shuffleArray(array: number[]): void {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}
// Helper function to get a new board with non-clue cells removed if no unique solution
export function solveWithClueCheck(board: number[][], isClue: boolean[][]): number[][] {
  if(checkWin(board))return board;
  // First, check if the board has a unique solution
  const solutionCount = solveOrCountSudoku(board, false); // Count all solutions

  if (solutionCount === 1) {
    // If it has a unique solution, solve the puzzle
    solveSudoku(board);
    return board;
  }

  // Otherwise, remove all non-clue cells and solve the puzzle
  const newBoard = board.map((row, rowIndex) => 
    row.map((cell, colIndex) => isClue[rowIndex][colIndex] ? cell : 0)
  );
  
  solveSudoku(newBoard); // Solve the reduced board
  return newBoard;
}
export function getHint(board: number[][], isClue: boolean[][]): number[][] {
  if(checkWin(board))return board;
  // Deep copy of the board to prevent mutation
  const boardCopy = board.map(row => [...row]);

  // Check if the board has a unique solution
  const solutionCount = solveOrCountSudoku(boardCopy, false); // Count all solutions

  if (solutionCount === 1) {
    // If there is a unique solution, solve the entire board (but we will handle just one cell)
    solveSudoku(boardCopy);

    // Find the first empty non-clue cell and fill it
    const updatedBoard = board.map(row => [...row]); // Another deep copy for the result
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] === 0) {
          // Fill the first empty cell with the correct value
          updatedBoard[r][c] = boardCopy[r][c];
          return updatedBoard; // Return after updating one cell
        }
      }
    }
  } else {
    // If the board doesn't have a unique solution, remove one non-clue value
    const updatedBoard = board.map(row => [...row]);
    let hintFound = false;

    for (let r = 0; r < updatedBoard.length; r++) {
      for (let c = 0; c < updatedBoard[r].length; c++) {
        if (!isClue[r][c] && updatedBoard[r][c] !== 0 && !hintFound) {
          // Remove the first non-clue value
          updatedBoard[r][c] = 0;
          hintFound = true;
          break;
        }
      }
      if (hintFound) break;
    }
    return updatedBoard; // Return the modified board with one value removed
  }

  // If no hint is found (should not reach here), return the board unchanged
  return board;
}
export function checkWin(board: number[][]): boolean {
	// Check if there are any empty cells
	for (let row = 0; row < board.length; row++) {
		for (let col = 0; col < board[row].length; col++) {
			if (board[row][col] === 0) {
				return false; // Game is not a win if there are empty cells
			}
		}
	}

	// Check for conflicts
	const conflicts = checkConflicts(board);
	if (conflicts.length > 0) {
		return false; // Game is not a win if there are conflicts
	}

	// No empty cells and no conflicts, it's a win
	return true;
}
type OscillatorWaveType = 'sine' | 'square' | 'triangle' | 'sawtooth';

export const playSound = (
  audioContext: AudioContext,
  type: OscillatorWaveType,  // Ensure type is one of the valid oscillator types
  frequency: number,
  duration: number
) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type; // Now TypeScript knows 'type' is restricted to 'sine', 'square', etc.
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime); // Frequency in Hz
  gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Volume level (range 0 to 1)

  oscillator.connect(gainNode);  // Connect the oscillator to the gain node
  gainNode.connect(audioContext.destination);  // Connect the gain node to the speakers

  oscillator.start();  // Start the sound
  oscillator.stop(audioContext.currentTime + duration);  // Stop the sound after 'duration' seconds
};
