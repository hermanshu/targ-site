import React from 'react';

interface AccessibleFilterProps {
  label: string;
  options: Array<{ id: string; label: string }>;
  selectedIds: string[];
  onSelect: (id: string) => void;
  onDeselect: (id: string) => void;
}

/**
 * Доступный компонент фильтра с ARIA-метками и поддержкой клавиатуры
 */
export const AccessibleFilter: React.FC<AccessibleFilterProps> = ({
  label,
  options,
  selectedIds,
  onSelect,
  onDeselect,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent, optionId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const isSelected = selectedIds.includes(optionId);
      isSelected ? onDeselect(optionId) : onSelect(optionId);
    }
  };

  return (
    <fieldset className="border rounded-lg p-4">
      <legend className="text-lg font-semibold mb-3" id={`${label}-legend`}>
        {label}
      </legend>
      <div
        className="space-y-2"
        role="group"
        aria-labelledby={`${label}-legend`}
      >
        {options.map((option) => {
          const isChecked = selectedIds.includes(option.id);
          return (
            <div key={option.id} className="flex items-center">
              <input
                type="checkbox"
                id={option.id}
                checked={isChecked}
                onChange={(e) =>
                  e.target.checked ? onSelect(option.id) : onDeselect(option.id)
                }
                onKeyDown={(e) => handleKeyDown(e, option.id)}
                className="w-4 h-4 cursor-pointer"
                aria-label={`Выбрать ${option.label}`}
              />
              <label htmlFor={option.id} className="ml-2 cursor-pointer">
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
};

interface AccessibleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  ariaLabel?: string;
}

/**
 * Доступная кнопка с поддержкой loading стейта и ARIA
 */
export const AccessibleButton = React.forwardRef<
  HTMLButtonElement,
  AccessibleButtonProps
>(({ isLoading, ariaLabel, children, disabled, ...props }, ref) => (
  <button
    ref={ref}
    disabled={disabled || isLoading}
    aria-disabled={disabled || isLoading}
    aria-label={ariaLabel}
    aria-busy={isLoading}
    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    {...props}
  >
    {isLoading ? (
      <>
        <span className="inline-block animate-spin mr-2">⏳</span>
        Загрузка...
      </>
    ) : (
      children
    )}
  </button>
));

AccessibleButton.displayName = 'AccessibleButton';
