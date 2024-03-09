import React from 'react';
import { render, screen } from '@/test-utils/utils';
import userEvent from '@testing-library/user-event';
import SearchResult from './SearchResult';
import { store } from '@/store';

describe('SearchResult', () => {
  const business: any = {
    _id: '999',
    companyName: 'Test Company',
    address: '123 Main St',
    phone: '1234567890',
    description: 'This is a test description',
  };

  test('renders business details correctly', () => {
    render(<SearchResult business={business} />);

    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('+1 (123) 456-7890')).toBeInTheDocument();
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  test('dispatches actions on click', async () => {
    render(<SearchResult business={business} />);

    const searchResult = screen.getByText('Test Company');
    await userEvent.click(searchResult);

    const state = store.getState();
    expect(state.ui.selectedBusinessID).toEqual('999');
    expect(state.ui.detailsDrawer.isOpen).toEqual(true);
    expect(state.ui.editsDrawer.isOpen).toEqual(false);
    // expect(state.search.businessDetails).toEqual({});
  });
});
