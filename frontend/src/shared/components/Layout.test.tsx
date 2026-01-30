import { render, screen } from '@testing-library/react';
import Layout from './Layout';
import { useAuth } from '../../login/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, Mock } from 'vitest';

vi.mock('../../login/AuthContext');

const mockUseAuth = useAuth as unknown as Mock;

describe('Layout Component', () => {
  it('renders login/register links when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('renders user info and logout when authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User' },
      logout: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome, Test User')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
