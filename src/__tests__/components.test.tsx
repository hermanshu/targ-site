import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListingCardSkeleton, ErrorState, EmptyState } from '../components/LoadingSkeletons';
import { AccessibleButton } from '../components/Accessible';

/**
 * Тесты для LoadingSkeletons компонентов
 */
describe('LoadingSkeletons', () => {
  test('ListingCardSkeleton рендерится без ошибок', () => {
    render(<ListingCardSkeleton />);
    const skeleton = screen.getByRole('presentation', { hidden: true });
    expect(skeleton).toBeInTheDocument();
  });

  test('ErrorState показывает кнопку при передачи onRetry', () => {
    const mockRetry = jest.fn();
    render(
      <ErrorState
        title="Тестовая ошибка"
        message="Это сообщение об ошибке"
        onRetry={mockRetry}
      />
    );

    const button = screen.getByText('Попробовать еще раз');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  test('ErrorState не показывает кнопку без onRetry', () => {
    render(
      <ErrorState title="Тестовая ошибка" message="Это сообщение об ошибке" />
    );

    const button = screen.queryByText('Попробовать еще раз');
    expect(button).not.toBeInTheDocument();
  });

  test('EmptyState рендерится с иконкой', () => {
    render(<EmptyState title="Ничего нет" icon="📭" />);
    const icon = screen.getByText('📭');
    expect(icon).toBeInTheDocument();
  });
});

/**
 * Тесты для AccessibleButton
 */
describe('AccessibleButton', () => {
  test('AccessibleButton рендерится и кликается', () => {
    const mockClick = jest.fn();
    render(<AccessibleButton onClick={mockClick}>Нажми меня</AccessibleButton>);

    const button = screen.getByText('Нажми меня');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  test('AccessibleButton отключается при loading', () => {
    render(<AccessibleButton isLoading>Загрузка</AccessibleButton>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  test('AccessibleButton имеет правильные ARIA атрибуты', () => {
    render(<AccessibleButton ariaLabel="Отправить форму">Отправить</AccessibleButton>);

    const button = screen.getByRole('button', { name: 'Отправить форму' });
    expect(button).toHaveAttribute('aria-label', 'Отправить форму');
  });
});
