import { cn } from "@/lib/utils";

// Text Component
interface LogoTextProps extends React.ComponentProps<"span"> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
}

const textSizeVariants = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-4xl",
  "2xl": "text-5xl",
  "3xl": "text-6xl",
  "4xl": "text-7xl",
};

const LogoText = ({ className, size = "lg", ...props }: LogoTextProps) => {
  return (
    <span className={cn("font-bold", textSizeVariants[size], className)} {...props}>
      <span className='text-lavive'>Lavi</span>
      <span className='text-purple-700'>Ploo</span>
    </span>
  );
};

// Icon Component
interface LogoIconProps extends React.ComponentProps<"svg"> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  variant?: "white" | "lavive";
  strokeWidth?: "0" | "1" | "2" | "3" | "4";
}

const iconSizeVariants = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
  "2xl": "h-20 w-20",
  "3xl": "h-24 w-24",
  "4xl": "h-32 w-32",
};

const variantStyles = {
  white: "text-white",
  lavive: "text-lavive",
};

const strokeWidthVariants = {
  "0": "stroke-0",
  "1": "stroke-1",
  "2": "stroke-2",
  "3": "[stroke-width:3]",
  "4": "[stroke-width:4]",
};

const LogoIcon = ({ className, size = "md", variant = "lavive", strokeWidth = "2", ...props }: LogoIconProps) => {
  return (
    <svg
      viewBox='-6 0 50 35'
      preserveAspectRatio='xMidYMid meet'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
      className={cn(iconSizeVariants[size], variantStyles[variant], strokeWidthVariants[strokeWidth], "fill-lavive", className)}
      {...props}>
      <path
        d='M34.2791 12.9847L34.2621 12.9607C33.2265 11.4018 31.8406 10.1067 30.2152 9.17902C28.5899 8.25129 26.77 7.71661 24.9011 7.61768C25.101 8.2089 25.2594 8.81336 25.3751 9.42667C26.872 9.59522 28.3132 10.0919 29.5961 10.8813C30.879 11.6707 31.972 12.7334 32.7971 13.9937C33.5368 15.0944 34.0487 16.332 34.3027 17.6337C34.5567 18.9353 34.5477 20.2746 34.2761 21.5727C34.0023 22.891 33.4707 24.1422 32.7121 25.2546C31.9534 26.367 30.9825 27.3185 29.8551 28.0547C26.6431 30.0857 19.8651 32.0217 14.5211 32.2717C13.6799 32.9814 12.7464 33.5738 11.7461 34.0327C14.3279 34.1781 16.9178 33.9967 19.4541 33.4927C23.436 32.833 27.2776 31.5042 30.8161 29.5627C32.1444 28.697 33.2886 27.5774 34.1829 26.2682C35.0772 24.9589 35.7039 23.4859 36.0271 21.9337C36.3486 20.4009 36.3595 18.8192 36.0593 17.2822C35.7591 15.7451 35.1537 14.2838 34.2791 12.9847V12.9847Z'
        fill='currentColor'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M17.6567 9.1395L17.6177 9.16248C14.8897 10.8135 11.5307 14.2985 8.85074 18.2575C7.1617 20.6352 5.8655 23.2687 5.01172 26.0575C5.09372 26.2575 5.17705 26.4535 5.26172 26.6455C5.57802 27.3754 5.95854 28.0759 6.39874 28.7385C6.39074 23.5845 13.3747 13.8385 18.5267 10.7035C19.1264 10.3831 19.7536 10.117 20.4007 9.90848C20.2694 9.32443 20.0801 8.75496 19.8357 8.2085C19.0825 8.45171 18.3532 8.76334 17.6567 9.1395V9.1395Z'
        fill='currentColor'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M0.442256 8.93761L0.431239 8.98159C-0.276761 12.0906 -0.103742 16.9286 0.882258 21.6056C1.96826 26.7576 3.48225 31.0396 5.63525 32.7426C6.35283 33.3084 7.22378 33.6456 8.13525 33.7106C8.69011 33.6999 9.24279 33.638 9.78625 33.5256C13.2933 32.4586 17.0232 27.6366 18.7252 25.0656C21.0173 21.7441 22.7308 18.0588 23.7932 14.1656C24.0935 12.6088 24.0832 11.008 23.7628 9.45528C23.4424 7.90251 22.8183 6.42837 21.9263 5.1176C21.0465 3.82179 19.9158 2.7155 18.6012 1.86409C17.2866 1.01269 15.8146 0.433442 14.2722 0.160602H14.2433C13.1261 -0.0087491 11.9928 -0.044321 10.8672 0.0546145C8.42842 0.287705 6.12024 1.26491 4.25546 2.85387C2.39068 4.44283 1.05947 6.56669 0.442256 8.93761ZM20.4423 6.12761C21.2002 7.24045 21.7308 8.49203 22.0037 9.8105C22.2765 11.129 22.2862 12.4884 22.0323 13.8106C20.9063 19.2486 13.9933 30.3726 9.26126 31.8106C8.93736 31.878 8.608 31.9159 8.27725 31.9236C7.7191 31.8866 7.18528 31.6812 6.74624 31.3346C3.14624 28.4906 1.15927 17.5836 1.89627 11.0916C2.05397 9.592 2.5186 8.1409 3.26126 6.8286C4.03762 5.42499 5.14805 4.23441 6.49426 3.36229C7.84046 2.49017 9.3809 1.9634 10.9792 1.8286C11.9747 1.74362 12.9767 1.77719 13.9643 1.92861C15.2694 2.16114 16.5148 2.65242 17.6271 3.37355C18.7395 4.09468 19.6963 5.03109 20.4412 6.12761H20.4423Z'
        fill='currentColor'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

// Full Component
interface LogoFullProps extends React.ComponentProps<"div"> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  iconVariant?: "white" | "lavive";
  spacing?: "none" | "tight" | "normal" | "wide";
  strokeWidth?: "0" | "1" | "2" | "3" | "4";
}

const spacingVariants = {
  none: "gap-0",
  tight: "gap-1",
  normal: "gap-2",
  wide: "gap-4",
};

const LogoFull = ({ className, size = "lg", iconVariant = "lavive", spacing = "none", strokeWidth = "1", ...props }: LogoFullProps) => {
  return (
    <div className={cn("flex items-center", spacingVariants[spacing], className)} {...props}>
      <LogoIcon size={size} variant={iconVariant} strokeWidth={strokeWidth} />
      <LogoText size={size} />
    </div>
  );
};

// Main Logo export with composition pattern
export { LogoIcon, LogoText, LogoFull };
