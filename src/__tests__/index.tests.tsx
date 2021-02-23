import React, { useState, useEffect } from 'react';
import { render, waitFor, act } from '@testing-library/react';
import useWaitForElements from '../index';

const TestHookComponent = () => {
  const [firstElementIsVisible, setFirstElementIsVisible] = useState(false);
  const [secondElementIsVisible, setSecondElementIsVisible] = useState(false);
  const hookResult = useWaitForElements({
      fixedElement: '#fixed-element', 
      firstElement: '#first-element',
      secondElement: '#second-element' 
  });

  useEffect(() => {
    const timeoutIndex = setTimeout(() => setFirstElementIsVisible(true), 200);
    
    return () => {
      clearTimeout(timeoutIndex);
    }
  }, [setFirstElementIsVisible]);

  useEffect(() => {
    let timeoutIndex: any = null;
    if (firstElementIsVisible) timeoutIndex = setTimeout(() => setSecondElementIsVisible(true), 100);
    
    return () => {
      if (timeoutIndex) clearTimeout(timeoutIndex);
    }
  }, [firstElementIsVisible, setSecondElementIsVisible]);

  return (
    <div id='body'>
      <h1 id='fixed-element'>Fixed element</h1>
      {firstElementIsVisible && <h1 id='first-element'>First Element</h1>}
      {secondElementIsVisible && <h1 id='second-element'>Second Element</h1>}
      {hookResult.fixedElement && <h1>Hook fixed element</h1>}
      {hookResult.firstElement && <h1>Hook first element</h1>} 
      {hookResult.secondElement && <h1>Hook second element</h1>}
    </div>
  );
};

const setup = () => render(<TestHookComponent />);

describe('Component is rendered', () => {
  it('Should return fixed element is on the screen', async () => {
    const { queryByText } = setup();
    await waitFor(() => expect(queryByText(/Hook fixed element/g)).toBeInTheDocument());
  });

  it('Should return both elements are null', async () => {
    const { queryByText } = setup();
    await act(async () => {
      expect(queryByText(/Hook first element/g)).not.toBeInTheDocument();
      expect(queryByText(/Hook second element/g)).not.toBeInTheDocument();
    });
  });

  describe('And 2s has passed', () => {
    it('Should contain first element but not the second', async () => {
      const { queryByText } = setup();
      await waitFor(() => expect(queryByText(/Hook first element/g)).toBeInTheDocument());
      expect(queryByText(/Second first element/g)).not.toBeInTheDocument();
    });
  
    describe('And more 1s has passed', () => {
      it('Should contain first and second element are in the screen', async () => {
        const { queryByText } = setup();
        await waitFor(() => expect(queryByText(/Hook first element/g)).toBeInTheDocument());
        await waitFor(() => expect(queryByText(/Hook second element/g)).toBeInTheDocument());
      });  
    });
  });
});