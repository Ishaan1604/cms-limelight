import { it, expect, describe, beforeEach, afterEach, vitest} from 'vitest'
import { ResetPassword } from '../../../pages/auth'
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

const MockedResetPassword = () => {
    return (
        <AppProvider>
            <BrowserRouter><ResetPassword/></BrowserRouter>
        </AppProvider>
    )
}

describe('Reset Password', () => {
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
        render(<MockedResetPassword/>)

        const email = screen.getByLabelText('email')
        const password = screen.getByLabelText('password')
        const button = screen.getByRole('button')

        expect(email).toBeInTheDocument();
        expect(password).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    })

    it('should handle change', () => {
        render(<MockedResetPassword/>)

        const email = screen.getByLabelText('email')
        const password = screen.getByLabelText('password')

        fireEvent.change(email, {target: {value: 'newEmail', name: 'email'}})
        fireEvent.change(password, {target: {value: 'newPassword', name: 'password'}})

        expect(email.value).toBe('newEmail');
        expect(password.value).toBe('newPassword');
    })

    it('should render the error components', async () => {
        axiosMock.onPatch('http://localhost:3000/api/v1/cms/auth/resetPassword').reply(400, {
            msg: 'Bad Request Error'
        })
        render(<MockedResetPassword />)

        const button = screen.getByRole('button')

        fireEvent.click(button);

        await waitFor(() => expect(screen.getByText('Bad Request Error')).toBeInTheDocument());
    })

    it('should reset the password', async () => {
        axiosMock.onPatch('http://localhost:3000/api/v1/cms/auth/resetPassword').reply(200, {
            person: {email: 'test@gmail.com', name: 'test', personType: 'user'},
            token: 'testToken'
        })
        render(<MockedResetPassword />)

        const email = screen.getByLabelText(/email/i)
        const password = screen.getByLabelText(/password/i)
        const button = screen.getByRole('button')

        fireEvent.change(email, {target: {value: 'test@gmail.com', name: 'email'}})
        fireEvent.change(password, {target: {value: 'test123', name: 'password'}})

        fireEvent.click(button);
        const loading = screen.getByText('', {selector: 'div.loading > p'})
        expect(loading).toBeInTheDocument();
        
        await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
        
        expect(screen.getByText("Changed password successfully")).toBeInTheDocument();
        expect(screen.getByLabelText('email').value).toBe('');
        expect(screen.getByLabelText('password').value).toBe('');

        expect(mockNavigate).toHaveBeenCalledWith('/auth/login')
    })

})