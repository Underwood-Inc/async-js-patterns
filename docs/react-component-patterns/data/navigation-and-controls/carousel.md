---
title: Carousel Component
description: Component for displaying a slideshow of content with navigation controls
date: 2024-01-01
author: Underwood Inc
tags:
  - Data Display
  - Carousel
  - Slideshow
  - React
---

# Carousel Component

## Overview

The Carousel component provides a slideshow interface for cycling through elements like images, cards, or custom content. It supports various navigation options, transitions, and responsive behavior.

## Usage

### Basic Carousel

::: code-with-tooltips

```tsx
import { Carousel } from '@/components/data';

<Carousel>
  <Carousel.Item>
    <img src="/slide1.jpg" alt="Slide 1" />
  </Carousel.Item>
  <Carousel.Item>
    <img src="/slide2.jpg" alt="Slide 2" />
  </Carousel.Item>
  <Carousel.Item>
    <img src="/slide3.jpg" alt="Slide 3" />
  </Carousel.Item>
</Carousel>
```

:::

### API Reference

```tsx
interface CarouselProps {
  /** Carousel slides */
  children: React.ReactNode;
  /** Current active index */
  activeIndex?: number;
  /** Default active index */
  defaultActiveIndex?: number;
  /** Index change handler */
  onSlideChange?: (index: number) => void;
  /** Whether to show navigation arrows */
  arrows?: boolean;
  /** Whether to show indicator dots */
  indicators?: boolean;
  /** Whether to auto-play slides */
  autoPlay?: boolean;
  /** Auto-play interval in ms */
  interval?: number;
  /** Transition duration in ms */
  duration?: number;
  /** Whether to pause on hover */
  pauseOnHover?: boolean;
  /** Whether to loop slides */
  infinite?: boolean;
  /** Additional CSS class */
  className?: string;
}

interface CarouselItemProps {
  /** Slide content */
  children: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}
```

### Examples

#### With Custom Navigation

::: code-with-tooltips

```tsx
<Carousel
  arrows={false}
  renderNavigation={({ goNext, goPrev, currentIndex, totalSlides }) => (
    <div className="custom-nav">
      <button onClick={goPrev} disabled={currentIndex === 0}>
        Previous
      </button>
      <span>{currentIndex + 1} / {totalSlides}</span>
      <button onClick={goNext} disabled={currentIndex === totalSlides - 1}>
        Next
      </button>
    </div>
  )}
>
  {slides.map((slide, index) => (
    <Carousel.Item key={index}>
      {slide.content}
    </Carousel.Item>
  ))}
</Carousel>
```

:::

## Implementation

### Core Component

::: code-with-tooltips

```tsx
export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(({
  children,
  activeIndex: controlledIndex,
  defaultActiveIndex = 0,
  onSlideChange,
  arrows = true,
  indicators = true,
  autoPlay = false,
  interval = 5000,
  duration = 300,
  pauseOnHover = true,
  infinite = true,
  className,
  ...props
}, ref) => {
  const [currentIndex, setCurrentIndex] = useState(defaultActiveIndex);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const activeIndex = controlledIndex ?? currentIndex;
  const slides = React.Children.toArray(children);
  const totalSlides = slides.length;
  
  const goToSlide = useCallback((index: number) => {
    const nextIndex = infinite
      ? (index + totalSlides) % totalSlides
      : Math.max(0, Math.min(index, totalSlides - 1));
    
    setCurrentIndex(nextIndex);
    onSlideChange?.(nextIndex);
  }, [infinite, totalSlides, onSlideChange]);
  
  const goNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);
  
  const goPrev = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);
  
  useEffect(() => {
    if (autoPlay && !isHovered) {
      const timer = setInterval(goNext, interval);
      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, isHovered, goNext]);
  
  return (
    <div
      ref={mergeRefs([ref, containerRef])}
      className={clsx('carousel', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div
        className="carousel__track"
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
          transition: `transform ${duration}ms`
        }}
      >
        {slides.map((slide, index) => (
          React.cloneElement(slide as React.ReactElement, {
            key: index,
            'aria-hidden': index !== activeIndex
          })
        ))}
      </div>
      
      {arrows && (
        <>
          <button
            className="carousel__arrow carousel__arrow--prev"
            onClick={goPrev}
            disabled={!infinite && activeIndex === 0}
            aria-label="Previous slide"
          >
            <Icon name="chevron-left" />
          </button>
          <button
            className="carousel__arrow carousel__arrow--next"
            onClick={goNext}
            disabled={!infinite && activeIndex === totalSlides - 1}
            aria-label="Next slide"
          >
            <Icon name="chevron-right" />
          </button>
        </>
      )}
      
      {indicators && (
        <div className="carousel__indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={clsx(
                'carousel__indicator',
                { 'carousel__indicator--active': index === activeIndex }
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

Carousel.Item = function CarouselItem({
  children,
  className,
  ...props
}: CarouselItemProps) {
  return (
    <div
      className={clsx('carousel__item', className)}
      {...props}
    >
      {children}
    </div>
  );
};
```

:::

## Styling

### Base Styles

::: code-with-tooltips

```scss
.carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
  
  // Track styles
  &__track {
    display: flex;
    width: 100%;
    height: 100%;
    will-change: transform;
  }
  
  // Item styles
  &__item {
    flex: 0 0 100%;
    width: 100%;
    height: 100%;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  // Navigation arrows
  &__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 0.8;
    }
    
    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    
    &--prev {
      left: var(--spacing-md);
    }
    
    &--next {
      right: var(--spacing-md);
    }
  }
  
  // Indicator dots
  &__indicators {
    position: absolute;
    bottom: var(--spacing-md);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: var(--spacing-sm);
  }
  
  &__indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.2s;
    
    &--active {
      background: white;
      transform: scale(1.2);
    }
  }
}
```

:::

## Testing

### Unit Tests

::: code-with-tooltips

```tsx
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Carousel } from './Carousel';

describe('Carousel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders slides correctly', () => {
    render(
      <Carousel>
        <Carousel.Item>Slide 1</Carousel.Item>
        <Carousel.Item>Slide 2</Carousel.Item>
      </Carousel>
    );
    
    expect(screen.getByText('Slide 1')).toBeVisible();
    expect(screen.getByText('Slide 2')).not.toBeVisible();
  });

  it('handles navigation', () => {
    render(
      <Carousel>
        <Carousel.Item>Slide 1</Carousel.Item>
        <Carousel.Item>Slide 2</Carousel.Item>
      </Carousel>
    );
    
    fireEvent.click(screen.getByLabelText('Next slide'));
    expect(screen.getByText('Slide 2')).toBeVisible();
    
    fireEvent.click(screen.getByLabelText('Previous slide'));
    expect(screen.getByText('Slide 1')).toBeVisible();
  });

  it('auto-plays slides', () => {
    render(
      <Carousel autoPlay interval={1000}>
        <Carousel.Item>Slide 1</Carousel.Item>
        <Carousel.Item>Slide 2</Carousel.Item>
      </Carousel>
    );
    
    expect(screen.getByText('Slide 1')).toBeVisible();
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(screen.getByText('Slide 2')).toBeVisible();
  });
});
```

:::

## Accessibility

### Keyboard Navigation

::: code-with-tooltips

```tsx
const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(({
  // ... other props
}, ref) => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goPrev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goNext();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;
    }
  }, [goPrev, goNext, goToSlide, totalSlides]);
  
  return (
    <div
      ref={ref}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* ... */}
    </div>
  );
});
```

:::

## Best Practices

### Usage Guidelines

::: code-with-tooltips

```tsx
// DO: Provide meaningful alt text
<Carousel>
  <Carousel.Item>
    <img src="/product1.jpg" alt="Red leather shoes" />
  </Carousel.Item>
</Carousel>

// DON'T: Use for critical content
<Carousel autoPlay> {/* Important content might be missed */}
  <Carousel.Item>
    <Alert severity="error">Critical warning</Alert>
  </Carousel.Item>
</Carousel>

// DO: Handle loading states
<Carousel
  loadingComponent={<Skeleton height={400} />}
  onImageLoad={() => setLoading(false)}
>
  {images.map(image => (
    <Carousel.Item key={image.id}>
      <img src={image.url} alt={image.alt} />
    </Carousel.Item>
  ))}
</Carousel>

// DON'T: Mix aspect ratios
<Carousel>
  <Carousel.Item>
    <img style={{ height: 200 }} /> {/* Inconsistent sizing */}
  </Carousel.Item>
</Carousel>
```

:::

### Performance Considerations

::: code-with-tooltips

```tsx
// DO: Lazy load non-visible slides
const Carousel = ({ items }) => {
  const [loadedIndexes, setLoadedIndexes] = useState(new Set([0]));
  
  const handleSlideChange = useCallback((index: number) => {
    setLoadedIndexes(prev => new Set([...prev, index]));
  }, []);
  
  return (
    <Carousel onSlideChange={handleSlideChange}>
      {items.map((item, index) => (
        <Carousel.Item key={item.id}>
          {loadedIndexes.has(index) ? (
            <img src={item.url} alt={item.alt} />
          ) : (
            <Skeleton />
          )}
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

// DON'T: Create handlers inline
<Carousel
  onSlideChange={(index) => console.log(index)} // Creates new function every render
/>
```

:::
