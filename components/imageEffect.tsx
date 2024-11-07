import Image from 'next/image';
import { MouseEvent, useState } from 'react';

// Constants for magnifier size and zoom level
const MAGNIFIER_SIZE = 150;
const ZOOM_LEVEL = 2;

const ImageEffect = ({ src }: { src: string }) => {
    // State variables
    const [zoomable, setZoomable] = useState(false);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [position, setPosition] = useState({ x: 100, y: 100, mouseX: 0, mouseY: 0 });

    // Event handlers
    const handleMouseEnter = (e: MouseEvent) => {
        let element = e.currentTarget;
        let { width, height } = element.getBoundingClientRect();
        setImageSize({ width, height });
        setZoomable(true);
        updatePosition(e);
    };

    const handleMouseLeave = (e: MouseEvent) => {
        setZoomable(false);
        updatePosition(e);
    };

    const handleMouseMove = (e: MouseEvent) => {
        updatePosition(e);
    };

    const updatePosition = (e: MouseEvent) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        let x = e.clientX - left;
        let y = e.clientY - top;
        setPosition({
            x: -x * ZOOM_LEVEL + (MAGNIFIER_SIZE / 2),
            y: -y * ZOOM_LEVEL + (MAGNIFIER_SIZE / 2),
            mouseX: x - (MAGNIFIER_SIZE / 2),
            mouseY: y - (MAGNIFIER_SIZE / 2),
        });
    };

    return (
        <div className='flex justify-center items-center cursor-crosshair'>
            <div
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                className=' relative overflow-hidden '
            >
                {/* Image passed through props */}
                <Image className='object-cover border z-10' alt="" src={src} height={640} width={640}/>

                {/* Black overlay on hover */}
                {zoomable && (
                    <div className='absolute inset-0 bg-black opacity-30 z-20'></div>
                )}

                {/* Zoom effect */}
                <div
                    style={{
                        backgroundPosition: `${position.x}px ${position.y}px`,
                        backgroundImage: `url(${src})`,
                        backgroundSize: `${imageSize.width * ZOOM_LEVEL}px ${imageSize.height * ZOOM_LEVEL}px`,
                        backgroundRepeat: 'no-repeat',
                        display: zoomable ? 'block' : 'none',
                        top: `${position.mouseY}px`,
                        left: `${position.mouseX}px`,
                        width: `${MAGNIFIER_SIZE}px`,
                        height: `${MAGNIFIER_SIZE }px`,
                    }}
                    className={`z-50 pointer-events-none absolute `}
                />
            </div>
        </div>
    );
};

export default ImageEffect;
