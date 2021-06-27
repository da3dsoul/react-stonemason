import React from 'react';
import Stonemason from 'react-stonemason';

const ExampleInner = (props) => {
    const photo = props.photo
    return (
        <div key={props.key} style={{display: 'flex', flexDirection: 'column', backgroundColor: '#aaaaaa', ...(props.style || {})}}>
            <img src={photo.src} alt={photo.title} style={{width: '100%', objectFit: 'contain'}}/>
            <h1>{photo.title}</h1>
        </div>
    );
}

export default ExampleInner;
