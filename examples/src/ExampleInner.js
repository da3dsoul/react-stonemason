import React from 'react';
import Stonemason from 'react-stonemason';

const ExampleBasic = ({title, photos}) => {
    return (
      <div>
        <h2>{title}</h2>
        <Stonemason>
            {photos}
        </Stonemason>
      </div>
    );
}

export default ExampleBasic;
