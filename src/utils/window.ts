import React, { useRef } from "react";
import { useEffect, useState } from "react";
import breakingPoints from "./breakingPoints.json";

interface DOMEvent<T extends EventTarget> extends Event {
    readonly target: T;
}
// hook for window size

const useWindowSize = () => {
    // Initialize state with undefined width/height so server and client renders match
    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0,
    });
    useEffect(() => {
        // Handler to call on window resize
        const handleResize = () => {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        // Add event listener
        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
};

type BreakPointNames = "medium" | "smallDekstop" | "mobile" | "desktop";

const isInBreakpoint = (breakPoint: BreakPointNames) => {
    const { width } = useWindowSize();

    return width < parseInt(breakingPoints[breakPoint]);
};

const useComponentVisible = (initialIsVisible: boolean) => {
    const [isComponentVisible, setIsComponentVisible] =
        useState(initialIsVisible);
    const ref = useRef<any>(null);

    const handleClickOutside = (event: any) => {
        if (ref.current && !ref?.current?.contains(event.target)) {
            setIsComponentVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    return { ref, isComponentVisible, setIsComponentVisible };
};
export { useWindowSize, isInBreakpoint, useComponentVisible };
