import { it, expect, describe } from 'vitest'
import { Login } from '../../../pages/auth'
import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from '../../../context'
import '@testing-library/jest-dom/vitest'

const MockedLogin = () => {
    return (
        <AppProvider>
            <BrowserRouter><Login/></BrowserRouter>
        </AppProvider>
    )
}

describe('Login', () => {
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
})