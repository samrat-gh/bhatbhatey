import { Check } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(props.checked || false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsChecked(e.target.checked);
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          ref={ref}
          className="sr-only"
          {...props}
          onChange={handleChange}
        />
        <div
          className={cn(
            'w-4 h-4 border-2 rounded-sm border-gray-300 bg-white flex items-center justify-center transition-all duration-200',
            isChecked && 'bg-blue-600 border-blue-600',
            className
          )}
        >
          {isChecked && <Check className="w-3 h-3 text-white" />}
        </div>
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
