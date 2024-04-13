'use client';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useState } from 'react';
import Image from 'next/image';
import { type Image as img } from '@commercetools/platform-sdk';

export default function Carousel({
  slides,
  className,
  sizes,
}: {
  slides: img[];
  className: string;
  sizes: string;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  return (
    <>
      <div ref={sliderRef} className="keen-slider">
        {slides.map(im => (
          <Image
            className={className}
            style={{ visibility: loaded ? 'visible' : 'hidden' }}
            src={im.url}
            alt=""
            key={im.url}
            width={im.dimensions.w}
            height={im.dimensions.h}
            sizes={sizes}
          ></Image>
        ))}
      </div>
      {loaded && instanceRef.current && (
        <div className="dots">
          {[
            ...new Array(instanceRef.current.track.details.slides.length)
              .fill(0)
              .map((item, ind) => ind),
          ].map(idx => {
            return (
              <button
                key={idx}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx);
                }}
                className={'dot' + (currentSlide === idx ? ' active' : '')}
              ></button>
            );
          })}
        </div>
      )}
    </>
  );
}
