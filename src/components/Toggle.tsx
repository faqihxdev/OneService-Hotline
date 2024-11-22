import React, { useEffect, useRef, useState } from 'react';

interface ToggleProps {
  defaultValue?: boolean;
  labels?: [string, string];
  values?: [string, string];
  onChange?: (
    event: React.MouseEvent<HTMLDivElement>,
    value: string
  ) => void;
}

export function Toggle({
  defaultValue = false,
  labels = ['off', 'on'],
  values = ['off', 'on'],
  onChange = () => void 0,
}: ToggleProps) {
  const [enabled, setEnabled] = useState(defaultValue);
  const leftLabelRef = useRef<HTMLDivElement>(null);
  const rightLabelRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const leftLabel = leftLabelRef.current;
    const rightLabel = rightLabelRef.current;
    const background = backgroundRef.current;
    if (leftLabel && rightLabel && background) {
      if (enabled) {
        background.style.left = `${leftLabel.offsetWidth}px`;
        background.style.width = `${rightLabel.offsetWidth}px`;
      } else {
        background.style.left = '0px';
        background.style.width = `${leftLabel.offsetWidth}px`;
      }
    }
  }, [enabled]);

  return (
    <div
      data-component="Toggle"
      data-enabled={enabled}
      className="relative flex items-center gap-2 cursor-pointer overflow-hidden bg-zinc-900 text-zinc-950 h-10 rounded-[1000px] hover:bg-zinc-950"
      onClick={(event) => {
        setEnabled(!enabled);
        onChange(event, values[enabled ? 0 : 1]);
      }}
    >
      <div
        ref={leftLabelRef}
        className={`relative text-zinc-400 transition-colors duration-100 ease-in-out px-4 z-[2] select-none ${
          !enabled ? 'text-white' : ''
        }`}
      >
        {labels[0]}
      </div>
      <div
        ref={rightLabelRef}
        className={`relative text-zinc-400 transition-colors duration-100 ease-in-out px-4 z-[2] select-none -ml-2 ${
          enabled ? 'text-white' : ''
        }`}
      >
        {labels[1]}
      </div>
      <div
        ref={backgroundRef}
        className="bg-zinc-950 absolute top-0 left-0 w-auto bottom-0 z-[1] rounded-[1000px] transition-[left,width] duration-100 ease-in-out"
      />
    </div>
  );
}
