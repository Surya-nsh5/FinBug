import React from 'react';

const Skeleton = ({ className = '', variant = 'text', width, height }) => {
    const baseClasses = 'bg-[var(--color-input)] animate-pulse rounded';
    const variantClasses = {
        text: 'h-4 w-full',
        circular: 'rounded-full',
        rectangular: 'h-24 w-full',
    };

    const style = {
        width: width || undefined,
        height: height || undefined,
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant] || ''} ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
