import React from 'react';
import SudokuGrid from './components/SudokuGrid';
import GameMenu from './components/GameMenu';
import ImageProcessWindow from './components/ImageProcessWindow';
import { createWorker } from 'tesseract.js';
import './App.css';
import { checkConflicts, generateUniqueSudoku, solveWithClueCheck, getHint, checkWin, playSound } from './Utils';

type Symbol = {
	text: string;
	bbox: {
		x0: number;
		y0: number;
		x1: number;
		y1: number;
	};
	confidence: number;
};
type Board = number[][];

function App() {
	const [selectedCellIndex, setSelectedCellIndex] = React.useState<number>(0);
	const [selectedDifficulty, setSelectedDifficulty] = React.useState<string>('Easy');
	const [board, setBoard] = React.useState<number[][]>(() => generateUniqueSudoku(18));
	const [isClue, setIsClue] = React.useState<boolean[][]>(() => board.map(rowArr => rowArr.map(value => value!=0)));
	const [timerKey, setTimerKey] = React.useState(0);
	const [isProcessWindowVisible, setIsProcessWindowVisible] = React.useState<boolean>(false);
	const [processProgress, setProcessProgress] = React.useState<number>(0);
	const [uplodedImageSrc, setUploadedImageSrc] = React.useState<string>("");
	
	const processedImageDataRef = React.useRef<Board | null>(null);
	
	const audioContext = React.useRef(new (window.AudioContext || (window as any).webkitAudioContext)());

	// Update a specific cell in the board
	const updateCell = (row: number, col: number, value: number) => {
		setBoard((prevBoard) => {
			const newBoard = prevBoard.map((rowArr, rowIndex) =>
				rowArr.map((cell, colIndex) => (rowIndex === row && colIndex === col ? value : cell))
			);
			if(checkWin(newBoard)){
				alert(`you win ${selectedDifficulty} sudoku puzzle!`);
			}
			return newBoard;
		});
	};
	const playPlaceNumberSound = () => playSound(audioContext.current, 'square', 400, 0.15);
	const playRemoveNumberSound = () => playSound(audioContext.current, 'sine', 220, 0.3);
	const playChooseFillOptionSound = () => playSound(audioContext.current, 'triangle', 330, 0.5);
	const handleSelectedDifficulty = (difficulty: string) => {
		setSelectedDifficulty(difficulty);

		let newBoard: number[][];
		switch (difficulty) {
			case 'Easy':
				newBoard = generateUniqueSudoku(18);
				break;
			case 'Medium':
				newBoard = generateUniqueSudoku(30);
				break;
			case 'Hard':
				newBoard = generateUniqueSudoku(48);
				break;
			case "Custom":
				newBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
				break;
			default:
				newBoard = generateUniqueSudoku(18);
		}

		setBoard(newBoard); // Update board
		setIsClue(newBoard.map(rowArr => rowArr.map(value => value != 0))); // Calculate isClue based on the new board
		setTimerKey((prevKey) => prevKey + 1); // Increment the key to reset the Timer
	};

	const handleSolveButton = () => {
		setBoard(prevBoard => {
		  const updatedBoard = solveWithClueCheck(prevBoard, isClue);
		  const newBoard = updatedBoard.map(row => [...row]);
		  return newBoard;
		});
	  };

  // Function to update the board state with a hint
	  const handleHintButton = () => {
		setBoard(prevBoard => {
		  const updatedBoard = getHint(prevBoard, isClue);
		  const newBoard = updatedBoard.map(row => [...row]);
		  return newBoard;
		});
	  };
	// Handle option selection from FillOptionMenu
	const handleOptionClick = (index: number) => {
		setSelectedCellIndex(index);
	};
	React.useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const key = event.key;

			if (key >= '1' && key <= '9') {
				const index = parseInt(key, 10);
				setSelectedCellIndex(index);
			} else if (key === 'Backspace' || key === 'Delete' || key === '0') {
				setSelectedCellIndex(0);
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);
	const onImport = () => {
		setIsProcessWindowVisible(false);
		if(processedImageDataRef.current){
			setBoard(processedImageDataRef.current);
			setIsClue(Array.from({ length: 9 }, () => Array(9).fill(0)));
		}
	}
	const handleUploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];
			const imageUrl = URL.createObjectURL(file);
			setIsProcessWindowVisible(true);
			setUploadedImageSrc(imageUrl);
			const newBoard: Board | null = await processImage(file);
			processedImageDataRef.current = newBoard;
		}
	}
	const processImage = async (file: File): Promise<Board | null> => {
		if (file) {
			const imageUrl = URL.createObjectURL(file);

			try {
				const worker = await createWorker({
					logger: (m) => {
						if(m.status == 'recognizing text'){
							setProcessProgress(m.progress*100);
							console.log(m);
						}
					},
				});

				await worker.load();
				await worker.loadLanguage('eng');
				await worker.initialize('eng');
				await worker.setParameters({
					tessedit_char_whitelist: '123456789',
				});

				const { data } = await worker.recognize(imageUrl);
				await worker.terminate();

				const grid = createSudokuGrid(data.symbols);
				return grid;
			} catch (error) {
				alert('Error processing image:' + error);
				return null;
			}
		}
		return null;
	};

	const createSudokuGrid = (symbols: Symbol[]): number[][] => {
	const grid: Board = Array.from({ length: 9 }, () => Array(9).fill(0));

	const minX = Math.min(...symbols.map((symbol) => symbol.bbox.x0));
	const maxX = Math.max(...symbols.map((symbol) => symbol.bbox.x1));
	const minY = Math.min(...symbols.map((symbol) => symbol.bbox.y0));
	const maxY = Math.max(...symbols.map((symbol) => symbol.bbox.y1));

	const cellWidth = (maxX - minX) / 9;
	const cellHeight = (maxY - minY) / 9;

	symbols.forEach((symbol) => {
		const centerX = (symbol.bbox.x0 + symbol.bbox.x1) / 2;
		const centerY = (symbol.bbox.y0 + symbol.bbox.y1) / 2;

		const col = Math.floor((centerX - minX) / cellWidth);
		const row = Math.floor((centerY - minY) / cellHeight);

		if (row >= 0 && row < 9 && col >= 0 && col < 9) {
			const digit = parseInt(symbol.text, 10);
			if (!isNaN(digit)) {
				grid[row][col] = digit;
			}
		}
	});

	return grid; // Ensure a value is returned
};


	const conflicts = checkConflicts(board);

	return (
		<div className="App">
			<SudokuGrid
				selectedValue={selectedCellIndex}
				board={board}
				isClue={isClue}
				updateCell={updateCell}
				conflicts={conflicts}
				playPlaceNumberSound={playPlaceNumberSound}
				playRemoveNumberSound={playRemoveNumberSound}
			/>
			<GameMenu
				selectedValue={selectedCellIndex}
				onSelectValue={handleOptionClick}
				selectedDifficulty={selectedDifficulty}
				onChangeDifficulty={handleSelectedDifficulty}
				timerKey={timerKey}
				handleSolveButton={handleSolveButton}
				handleHintButton={handleHintButton}
				handleUploadImage={handleUploadImage}
			/>
			{isProcessWindowVisible && (<ImageProcessWindow 
				progress={processProgress}
				imageSrc={uplodedImageSrc}
				onImport={onImport}
				onClose={()=>{setIsProcessWindowVisible(false);}}
			/>)}
		</div>
	);
}

export default App;
