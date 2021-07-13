import React from 'react';
import Stonemason from 'react-stonemason';

const ExampleBasic = ({title, photos}) => {
    return (
      <div>
        <h2>{title}</h2>
        <Stonemason targetRowHeight={1000} minRowHeight={500} maxRowHeight={(width) => (window.innerHeight*0.9)} maxDeviation={0.5}>
            {photos}
        </Stonemason>
      </div>
    );
}

export default ExampleBasic;
