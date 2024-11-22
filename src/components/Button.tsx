import React from 'react';
import { Icon } from 'react-feather';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: Icon;
  iconPosition?: 'start' | 'end';
  iconColor?: 'red' | 'green' | 'grey';
  iconFill?: boolean;
  buttonStyle?: 'regular' | 'action' | 'alert' | 'flush';
}

export function Button({
  label = 'Okay',
  icon = void 0,
  iconPosition = 'start',
  iconColor = void 0,
  iconFill = false,
  buttonStyle = 'regular',
  ...rest
}: ButtonProps) {
  const StartIcon = iconPosition === 'start' ? icon : null;
  const EndIcon = iconPosition === 'end' ? icon : null;

  const baseClasses = "flex items-center gap-2 font-primary text-xs font-normal border-none rounded-[1000px] px-6 min-h-[42px] transition-all duration-100 ease-in-out outline-none";
  
  const styleClasses = {
    regular: "bg-zinc-100 text-zinc-900 hover:bg-zinc-300 disabled:text-zinc-500",
    action: "bg-zinc-900 text-zinc-100 hover:bg-zinc-600 disabled:text-zinc-500",
    alert: "bg-red-500 text-zinc-100 hover:bg-red-500 disabled:text-zinc-500",
    flush: "bg-transparent"
  };

  const iconColorClasses = {
    red: "text-red-600",
    green: "text-green-600",
    grey: "text-zinc-400"
  };

  const classes = [
    baseClasses,
    styleClasses[buttonStyle],
    "disabled:cursor-not-allowed",
    "enabled:cursor-pointer", 
    "enabled:active:translate-y-[1px]",
    "hover:bg-zinc-300"
  ].join(" ");

  return (
    <button 
      data-component="Button" 
      className={classes}
      {...rest}
    >
      {StartIcon && (
        <span className={`flex -ml-2 ${iconColor ? iconColorClasses[iconColor] : ''}`}>
          <StartIcon className={`w-4 h-4 ${iconFill ? 'fill-current' : ''}`} />
        </span>
      )}
      <span>{label}</span>
      {EndIcon && (
        <span className={`flex -mr-2 ${iconColor ? iconColorClasses[iconColor] : ''}`}>
          <EndIcon className={`w-4 h-4 ${iconFill ? 'fill-current' : ''}`} />
        </span>
      )}
    </button>
  );
}
