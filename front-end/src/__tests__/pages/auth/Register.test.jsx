import { it, expect, describe, beforeEach, afterEach, vitest} from 'vitest'
import { Register } from '../../../pages/auth'
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

const MockedRegister = () => {
    return (
        <AppProvider>
            <BrowserRouter><Register/></BrowserRouter>
        </AppProvider>
    )
}

describe('Register', () => {
    let axiosMock;

  beforeEach(() => {
    axiosMock = new MockAdapter(axios);
    vitest.resetAllMocks();
  });

  afterEach(() => {
    axiosMock.reset();
    cleanup();
  });

    it('should render the register page', () => {
        render(<MockedRegister/>)

        const email = screen.getByLabelText('email')
        const password = screen.getByLabelText('password')
        const name = screen.getByLabelText('name')
        const button = screen.getByRole('button')
        const login = screen.getByText('Login')

        expect(email).toBeInTheDocument();
        expect(password).toBeInTheDocument();
        expect(button).toBeInTheDocument();
        expect(login).toBeInTheDocument();
        expect(name).toBeInTheDocument();
    })

    it('should handle change', () => {
        render(<MockedRegister/>)

        const email = screen.getByLabelText('email')
        const password = screen.getByLabelText('password')
        const name = screen.getByLabelText('name')

        fireEvent.change(email, {target: {value: 'newEmail', name: 'email'}})
        fireEvent.change(password, {target: {value: 'newPassword', name: 'password'}})
        fireEvent.change(name, {target: {value: 'newName', name: 'name'}})

        expect(email.value).toBe('newEmail');
        expect(password.value).toBe('newPassword');
        expect(name.value).toBe('newName');
    })

    it('should navigate to login page', async () => {
        render(<MockedRegister/>)

        const login = screen.getByRole('link', {name: 'Login'})
        expect(login.href).toMatch(/\/auth\/login/);
    })

    it('should render the error components', async () => {
        axiosMock.onPost('http://localhost:3000/api/v1/cms/auth/register').reply(400, {
            msg: 'Bad Request Error'
        })
        render(<MockedRegister />)

        const button = screen.getByRole('button')

        fireEvent.click(button);

        await waitFor(() => expect(screen.getByText('Bad Request Error')).toBeInTheDocument());
    })

    it('should register the user', async () => {
        axiosMock.onPost('http://localhost:3000/api/v1/cms/auth/register').reply(201, {
            person: {email: 'test@gmail.com', name: 'test', personType: 'user'},
            token: 'testToken'
        })
        render(<MockedRegister />)

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
        expect(screen.getByText("Registered user successfully")).toBeInTheDocument();

        expect(mockNavigate).toHaveBeenCalledWith('/test')
    })

})