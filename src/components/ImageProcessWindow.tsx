import React from 'react';

type ImageProcessWindowProps = {
	progress: number;
	imageSrc: string | null;
	onImport: () => void;
	onClose: () => void;
};

const ImageProcessWindow: React.FC<ImageProcessWindowProps> = ({
	progress,
	imageSrc,
	onImport,
	onClose,
}) => {
	return (
		<div className="image-process-overlay">
			<div className="image-process-window">
				<button className="image-process-close-button" onClick={onClose}>
					✖
				</button>
				<canvas id="imageCanvas" className="image-process-canvas"></canvas>
				{imageSrc && (
					<img
						src={imageSrc}
						alt="Uploaded"
						style={{ display: 'none' }}
						onLoad={(e) => {
							const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
							const ctx = canvas?.getContext('2d');
							const img = e.target as HTMLImageElement;
							canvas.width = img.width;
							canvas.height = img.height;
							ctx?.drawImage(img, 0, 0, img.width, img.height);
						}}
					/>
				)}
				<div className="image-process-progress-bar">
					<div
						className="image-process-progress"
						style={{ width: `${progress}%` }}
					></div>
				</div>
				<button
					className="image-process-import-button"
					onClick={onImport}
					disabled={progress < 100}
				>
					Import Board
				</button>
			</div>
		</div>
	);
};

export default ImageProcessWindow;
