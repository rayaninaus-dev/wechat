import React from 'react';
import { Loader2 } from 'lucide-react';

// --- View ---
// https://developers.weixin.qq.com/miniprogram/dev/component/view.html
interface ViewProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverClass?: string;
  hoverStopPropagation?: boolean;
  hoverStartTime?: number;
  hoverStayTime?: number;
}

export const View: React.FC<ViewProps> = ({ 
  className = '', 
  hoverClass = 'opacity-70', 
  children, 
  onClick, 
  ...props 
}) => {
  return (
    <div 
      className={`${className} transition-opacity duration-200 active:${hoverClass}`}
      onClick={onClick} // React's onClick maps to bindtap
      {...props}
    >
      {children}
    </div>
  );
};

// --- Text ---
// https://developers.weixin.qq.com/miniprogram/dev/component/text.html
interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  userSelect?: boolean;
  space?: 'ensp' | 'emsp' | 'nbsp';
  decode?: boolean;
}

export const Text: React.FC<TextProps> = ({ 
  className = '', 
  userSelect = false, 
  children, 
  ...props 
}) => {
  return (
    <span 
      className={`${className} ${userSelect ? 'select-text' : 'select-none'}`}
      {...props}
    >
      {children}
    </span>
  );
};

// --- Button ---
// https://developers.weixin.qq.com/miniprogram/dev/component/button.html
interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type?: 'primary' | 'default' | 'warn';
  size?: 'default' | 'mini';
  plain?: boolean;
  loading?: boolean;
  formType?: 'submit' | 'reset' | 'button';
  openType?: string;
  hoverClass?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  className = '', 
  type = 'default', 
  size = 'default', 
  plain = false, 
  loading = false, 
  disabled = false,
  formType,
  children, 
  ...props 
}) => {
  let baseStyle = "flex items-center justify-center font-medium rounded-lg transition-all active:opacity-60 overflow-hidden relative";
  
  // Type Styles
  const typeStyles = {
    primary: plain 
      ? "bg-transparent text-[#07c160] border border-[#07c160]" 
      : "bg-[#07c160] text-white border border-[#07c160]",
    default: plain 
      ? "bg-transparent text-[#353535] border border-[#353535]" 
      : "bg-[#f2f2f2] text-[#07c160] border border-[#f2f2f2]",
    warn: plain 
      ? "bg-transparent text-[#E64340] border border-[#E64340]" 
      : "bg-[#E64340] text-white border border-[#E64340]",
  };

  // Size Styles
  const sizeStyles = {
    default: "py-3 px-6 text-base w-full",
    mini: "py-1 px-3 text-xs inline-flex w-auto",
  };

  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed grayscale" : "";

  return (
    <button 
      type={formType || 'button'}
      className={`${baseStyle} ${typeStyles[type]} ${sizeStyles[size]} ${disabledStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {loading && <Loader2 size={size === 'mini' ? 12 : 20} className="animate-spin mr-2" />}
      {children}
    </button>
  );
};

// --- Image ---
// https://developers.weixin.qq.com/miniprogram/dev/component/image.html
interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'top' | 'bottom' | 'center';
  lazyLoad?: boolean;
}

export const Image: React.FC<ImageProps> = ({ 
  className = '', 
  src, 
  mode = 'scaleToFill', 
  ...props 
}) => {
  let objectFitClass = 'object-fill';
  if (mode === 'aspectFit') objectFitClass = 'object-contain';
  if (mode === 'aspectFill') objectFitClass = 'object-cover';
  
  // 'widthFix' is handled by CSS normally (width: 100%, height: auto)
  const isWidthFix = mode === 'widthFix';

  return (
    <img 
      src={src} 
      className={`${className} ${objectFitClass} ${isWidthFix ? 'w-full h-auto' : 'h-full w-full'}`}
      loading={props.lazyLoad ? 'lazy' : 'eager'}
      {...props}
    />
  );
};

// --- ScrollView ---
// https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html
interface ScrollViewProps extends React.HTMLAttributes<HTMLDivElement> {
  scrollX?: boolean;
  scrollY?: boolean;
  upperThreshold?: number;
  lowerThreshold?: number;
  scrollTop?: number;
  scrollLeft?: number;
  scrollIntoView?: string;
  scrollWithAnimation?: boolean;
  enableFlex?: boolean; // In web, flex works by default if display:flex, but for WX compat
}

export const ScrollView: React.FC<ScrollViewProps> = ({ 
  className = '', 
  scrollX = false, 
  scrollY = false, 
  children, 
  enableFlex = false,
  ...props 
}) => {
  const scrollClass = `
    ${scrollY ? 'overflow-y-auto overflow-x-hidden' : ''}
    ${scrollX ? 'overflow-x-auto overflow-y-hidden' : ''}
    ${!scrollY && !scrollX ? 'overflow-hidden' : ''}
    scrollbar-hide
  `;
  
  return (
    <div 
      className={`${className} ${scrollClass} ${enableFlex ? 'flex' : ''}`}
      style={{
        ...props.style,
        WebkitOverflowScrolling: 'touch',
      } as any}
      {...props}
    >
      {children}
    </div>
  );
};