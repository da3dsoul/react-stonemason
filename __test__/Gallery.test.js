import React from 'react';
import Stonemason from '../src/Stonemason';
import { photos } from './test-photo-data';
import { mount } from 'enzyme';

describe('Stonemason', () => {
  let wrapper;
  afterEach(() => {
    if (wrapper && wrapper.length > 0) {
      wrapper.unmount();
    }
  });

  it('it matches correct snapshot', () => {
    wrapper = mount((
        <Stonemason>
          {photos.map(a => <img key={a.key} title={a.title} alt={a.alt} src={a.src} srcSet={a.srcSet} width={a.width} height={a.height} sizes={a.sizes} />)}
        </Stonemason>));
    expect(wrapper).toMatchSnapshot();
  });
});
