import React from 'react';

type FillOptionMenuProps = {
	selectedValue: number;
	onSelectValue: (value: number) => void;
};

const FillOptionMenu: React.FC<FillOptionMenuProps> = ({
	selectedValue,
	onSelectValue,
}) => {
	const cellOptions: string[] = ['🗑', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

	return (
		<div className="fill-option-menu">
			{cellOptions.map((value, index) => (
				<div
					key={index}
					className={`cell ${selectedValue === index ? 'active' : ''}`}
					onClick={() => onSelectValue(index)}
				>
					{value}
				</div>
			))}
		</div>
	);
};

export default FillOptionMenu;
