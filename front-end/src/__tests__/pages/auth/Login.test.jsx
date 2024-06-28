import { it, expect, describe, beforeEach, afterEach, vitest, vi} from 'vitest'
import { Login } from '../../../pages/auth'
import React from 'react'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter';
import {render, screen, fireEvent, waitFor, cleanup} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from '../../../context'
import '@testing-library/jest-dom/vitest'

global.localStorage = {
    setItem: vitest.fn(),
    getItem: vitest.fn(),
    removeItem: vitest.fn(),
  };

const mockNavigate = vitest.fn();

vitest.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
});

const MockedLogin = () => {
    return (
        <AppProvider>
            <BrowserRouter><Login/></BrowserRouter>
        </AppProvider>
    )
}

describe('Login', () => {
    let axiosMock;

  beforeEach(() => {
    axiosMock = new MockAdapter(axios);
    vitest.resetAllMocks();
  });

  afterEach(() => {
    axiosMock.reset();
    cleanup();
  });

    it('should render the login page', () => {
        render(<MockedLogin/>)

        const email = screen.getByLabelText('email')
        const password = screen.getByLabelText('password')
        const button = screen.getByRole('button')
        const register = screen.getByText('Register')
        const resetPassword = screen.getByText('Reset Password')

        expect(email).toBeInTheDocument();
        expect(password).toBeInTheDocument();
        expect(button).toBeInTheDocument();
        expect(register).toBeInTheDocument();
        expect(resetPassword).toBeInTheDocument();
    })

    it('should handle change', () => {
        render(<MockedLogin/>)

        const email = screen.getByLabelText('email')
        const password = screen.getByLabelText('password')

        fireEvent.change(email, {target: {value: 'newEmail', name: 'email'}})
        fireEvent.change(password, {target: {value: 'newPassword', name: 'password'}})

        expect(email.value).toBe('newEmail');
        expect(password.value).toBe('newPassword');
    })

    it('should navigate to register page', async () => {
        render(<MockedLogin/>)

        const register = screen.getByRole('link', {name: 'Register'})
        expect(register.href).toMatch(/\/auth\/register/);
    })

    it('should navigate to reset password page', async () => {
        render(<MockedLogin/>)

        const resetPassword = screen.getByRole('link', {name: 'Reset Password'})
        expect(resetPassword.href).toMatch(/\/auth\/resetPassword/);
    })

    it('should render the error components', async () => {
        axiosMock.onPost('http://localhost:3000/api/v1/cms/auth/login').reply(400, {
            msg: 'Bad Request Error'
        })
        render(<MockedLogin />)

        const button = screen.getByRole('button')

        fireEvent.click(button);

        await waitFor(() => expect(screen.getByText('Bad Request Error')).toBeInTheDocument());
    })

    it('should post the login', async () => {
        axiosMock.onPost('http://localhost:3000/api/v1/cms/auth/login').reply(200, {
            person: {email: 'test@gmail.com', name: 'test', personType: 'user'},
            token: 'testToken'
        })
        render(<MockedLogin />)

        const email = screen.getByLabelText(/email/i)
        const password = screen.getByLabelText(/password/i)
        const button = screen.getByRole('button')

        fireEvent.change(email, {target: {value: 'test@gmail.com', name: 'email'}})
        fireEvent.change(password, {target: {value: 'test123', name: 'password'}})

        fireEvent.click(button);
        const loading = screen.getByText('', {selector: 'div.loading > p'})
        expect(loading).toBeInTheDocument();
        
        await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
        
        expect(localStorage.setItem).toBeCalledWith('token', 'testToken')
        expect(localStorage.setItem).toBeCalledWith('email', 'test@gmail.com')
        expect(localStorage.setItem).toBeCalledWith('name', 'test')
        expect(localStorage.setItem).toBeCalledWith('role', 'user')

        expect(screen.getByLabelText('email').value).toBe('');
        expect(screen.getByLabelText('password').value).toBe('');
        expect(screen.getByText("Logged in user successfully")).toBeInTheDocument();

        expect(mockNavigate).toHaveBeenCalledWith('/test')
    })

})