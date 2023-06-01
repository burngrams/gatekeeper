import React from 'react'
import './Switch.css';

export const Switch = ({ onChange, checked }) => {
	return <label htmlFor="switchA1" className="switch-item">
		<input type="checkbox" name="" id="switchA1" className="control" onChange={onChange} checked={!checked} />
		<span className="label"></span>
	</label>;
}