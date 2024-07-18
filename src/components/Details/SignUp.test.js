import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '../../store';
import SignUp from './SignUp';

describe('SignUp component', () => {
  test('renders SignUp component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });
  test('shows error message for missing fields', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText(/Sign Up/i));

    expect(screen.getByText(/Please enter all credentials/i)).toBeInTheDocument();
})
test('shows error message for mismatched passwords', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'differentpassword' } });

    fireEvent.click(screen.getByText(/Sign Up/i));

    expect(screen.getByText(/Password and Confirm Password must be the same/i)).toBeInTheDocument();
  });
})
