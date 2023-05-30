import React from 'react';

// TODO extract
export function Section(props: { title: string; children: React.ReactNode; id: string; }) {
	return (
		<details id={props.id}>
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
