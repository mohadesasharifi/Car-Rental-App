declare module 'react-multi-carousel' {
    import React from 'react';

    interface ResponsiveType {
        [key: string]: {
            breakpoint: { max: number; min: number };
            items: number;
        };
    }

    interface CarouselProps {
        additionalTransfrom?: number;
        arrows?: boolean;
        autoPlay?: boolean;
        autoPlaySpeed?: number;
        centerMode?: boolean;
        className?: string;
        containerClass?: string;
        customButtonGroup?: JSX.Element;
        customLeftArrow?: JSX.Element;
        customRightArrow?: JSX.Element;
        draggable?: boolean;
        infinite?: boolean;
        keyBoardControl?: boolean;
        minimumTouchDrag?: number;
        pauseOnHover?: boolean;
        responsive: ResponsiveType;
        sliderClass?: string;
        slidesToSlide?: number;
        swipeable?: boolean;
        showDots?: boolean;
        renderDotsOutside?: boolean;
    }

    const Carousel: React.FC<CarouselProps>;

    export default Carousel;
}
