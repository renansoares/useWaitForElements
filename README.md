<div align="center">
<h1>useWaitForElements ⏳</h1>

<p>
A React hook to be used to know when elements are rendered built with 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver">
<strong>MutationObserver</a></strong>.
</p>

</div>

## When do I need it?

Sometimes, you need to know when elements are currently rendered. One of the ways to do it is using MutationObserver. Using MutationObserver, this hook allows to know when a list of elements are rendered. 

React provides a [`solution`](https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node) when you want to know if a component is rendered that might be better than using this hook in some cases.

**This hook only tracks until all the elements are rendered. It stops observing after it, so if you are observing elements that can change state after the first render. I would recommend forking the repository and changing it.**

## Installation

```shell
npm install --save usewaitforelements
```

## Usage

You need to pass to the hook an object with an identifier and a [`selector`](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors) for each element.

Hook will return an object with the id, and a boolean indicating the presence for each element.

## Example

```jsx
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import useWaitForElements from 'usewaitforelements'

function Component(...props) {
  const [shouldRender, setShouldRender] = useState(false);

  // Pass an object of ids and selectors to the hook
  const result = useWaitForElements({ element: '#elementId' });
  // Initial result will be { element: false }

  useEffect(() => {
      // Element will be rendered in 2 seconds
      setTimeout(() => setShouldRender(true), 2000);
      // After element is rendered, result will be { element: true }
  }, [setShouldRender]);

  return (<div>
            {shouldRender && <p id="elementId">Element</p>}
            {!result.element && <p>Element is not rendered</p>}
            {result.element && <p>Element is rendered</p>}
         </div>)
}
```

### 🐛 Bugs

Please open an issue if you find a bug.

### 💻 Pull Requests

Pull requests are welcome! Feel free to submit a PR if you feel like it.

## LICENSE
MIT