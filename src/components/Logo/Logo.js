import React from 'react';
import './Logo.css';
//import logo from './logo.jpg'

const Logo = () => {
	return (
		<div className='tl ma4 mt0'>
			<img alt="logo" src={`http://tachyons.io/img/logo.jpg`} 
						className="App-logo br-100 ba h4 w4 dib" />
		</div>
	);
}


export default Logo;

