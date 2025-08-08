import { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export default function Button({ variant = 'primary', className, children, ...rest }: Props) {
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  const styles: Record<Variant, string> = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-600',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-300',
  };
  return (
    <button className={clsx(base, styles[variant], className)} {...rest}>
      {children}
    </button>
  );
}


