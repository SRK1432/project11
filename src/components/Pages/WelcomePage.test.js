import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '../../store';
import WelcomePage from './WelcomePage';

describe('WelcomePage component', () => {
  test('renders WelcomePage component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <WelcomePage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Welcome to Expense Tracker!!!/i)).toBeInTheDocument();
  });

  test('handles email verification process', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <WelcomePage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText(/Verify Email/i));

    await waitFor(() => {
      expect(screen.getByText(/A verification email has been sent/i)).toBeInTheDocument();
    });
  });

  test('handles logout process', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <WelcomePage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText(/Logout/i));

    // Check for side effects or navigation
  });
});
