// types/react-rating-stars-component.d.ts

declare module 'react-rating-stars-component' {
    import { Component } from 'react';

    interface RatingProps {
        /* Add the props interface here based on the package documentation */
        // For example:
        count: number;
        value: number;
        onChange?: (newValue: number) => void;
        size?: number;
        color?: string;
        activeColor?: string;
        edit?: boolean;
        isHalf?: boolean;
        emptyIcon?: JSX.Element;
        halfIcon?: JSX.Element;
        filledIcon?: JSX.Element;
        classNames?: string;

        /* Add more props as needed */
    }

    class ReactStars extends Component<RatingProps> { }

    export default ReactStars;
}
