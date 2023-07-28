import React from 'react';
export function ProgressBar({ value, maxValue }) {
  return (
    <div className='w-full'>
      <div className='w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 relative'>
        <div
          className='bg-green-600 h-3 rounded-full dark:bg-green-500 relative transition-all duration-300'
          style={{
            width: `${(value / maxValue) * 100}%`,
            maxWidth: '100%',
          }}
        >
          {(value / maxValue) * 100 < 100 && (
            <p
              className={
                'text-xs mr-2 absolute right-0 top-0 leading-none text-white' +
                (value === 0 && ' -mr-3.5')
              }
            >
              {value}
            </p>
          )}
        </div>
        <p className='text-xs mr-2 absolute right-0 top-0 leading-none text-white'>
          {maxValue}
        </p>
      </div>
    </div>
  );
}
