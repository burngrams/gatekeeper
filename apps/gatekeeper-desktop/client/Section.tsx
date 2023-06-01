import React from 'react';

export function Section(props: { title: string; children: React.ReactNode; id: string; }) {
	return (
		<details id={props.id} open>
			<summary>
				<span className="icon">👇</span>
				<h2>{props.title}</h2>
			</summary>
			<div>
				{props.children}
			</div>
		</details>
	);
}
