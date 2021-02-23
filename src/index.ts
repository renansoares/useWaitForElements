import { useRef, useEffect, useState, useCallback } from 'react';

type WaitElements = Record<string, string>;

type WaitElementsResult = Record<string, boolean>;

const defaultObserverConfig = { childList: true, subtree: true };

/**
 *
 * useWaitForElements
 *
 * This hook returns an object with the elements and if the objects are present in the DOM.
 * It uses MutationObserver to detect if elements are present.
 *
 * @param {[key: string]: string} elements Object containg id, and selector of elements to be waited
 * @param {MutationObserverInit} observerOptions Options to be passed to the observer
 * @param {Node} observerNode Node to be observed, default is document.body.
 */
function useWaitForElements(elements: WaitElements,
    observerOptions: MutationObserverInit = defaultObserverConfig,
    observerNode: Node = document.body): WaitElementsResult {
    const [result, setResult] = useState({});
    const mutationObserver = useRef<MutationObserver | null>(null);

    const elementsString = JSON.stringify(elements);

    const stopObserver = () => {
        if (mutationObserver.current !== null) {
            mutationObserver.current.disconnect();
            mutationObserver.current = null;
        }
    };

    const refreshResult = useCallback(() => {
        let updatedResult = {};
        let hasMissingElements = false;

        const elementsJSON: WaitElements = JSON.parse(elementsString);

        for (const [element, selector] of Object.entries(elementsJSON)) {
            const isElementPresent = !!document.querySelector(selector);
            if (!isElementPresent)
                hasMissingElements = true;

            updatedResult = { ...updatedResult, [element]: isElementPresent };
        }

        if (!hasMissingElements)
            stopObserver();

        setResult(updatedResult);
    }, [elementsString]);

    useEffect(() => {
        const elementsJSON: WaitElements = JSON.parse(elementsString);

        if (mutationObserver.current === null && Object.keys(elementsJSON).length >= 1) {
            const observerCallback = (entries: MutationRecord[]) => {
                for (const entry of entries) {
                    if (entry.addedNodes.length >= 1)
                        refreshResult();
                }
            };

            mutationObserver.current = new MutationObserver(observerCallback);
            mutationObserver.current.observe(observerNode, observerOptions);
        }
    }, [elementsString, refreshResult, observerNode, observerOptions]);

    useEffect(() => {
        refreshResult();

        return () => {
            stopObserver();
        };
    }, [refreshResult]);

    return result;
}

export default useWaitForElements;