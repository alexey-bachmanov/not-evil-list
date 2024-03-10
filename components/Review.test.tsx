import React from 'react';
import { render, screen } from '@/test-utils/utils';
import Review from './Review';

// // Mock the models module
// jest.mock('@/models', () => ({
//   IReviewDocument: jest.fn(),
// }));

const mockReview: any = {
  _id: '1',
  user: {
    userName: 'John Doe',
  },
  rating: 4,
  createdAt: '2023-01-01T12:00:00Z',
  review: 'This is a great review!',
};

describe('Review', () => {
  test('renders without errors', () => {
    const { container } = render(<Review review={mockReview} />);
    expect(container).toBeInTheDocument();
  });

  test('displays review information', () => {
    render(<Review review={mockReview} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByTestId('rating')).toHaveAttribute(
      'aria-label',
      '4 Stars'
    );
    expect(screen.getByText('1/1/2023')).toBeInTheDocument();
    expect(screen.getByText('This is a great review!')).toBeInTheDocument();
  });

  test('gracefully handles missing date', () => {
    const mockReviewGarbled = { ...mockReview, createdAt: undefined };
    render(<Review review={mockReviewGarbled} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByTestId('rating')).toHaveAttribute(
      'aria-label',
      '4 Stars'
    );
    const dateRegex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    expect(screen.getByText(dateRegex)).toBeInTheDocument();
    expect(screen.getByText('This is a great review!')).toBeInTheDocument();
  });
});
