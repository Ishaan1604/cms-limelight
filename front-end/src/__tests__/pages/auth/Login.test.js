import { it, expect, describe } from 'vitest'
import { Login } from '../../../pages/auth/Login'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Login', () => {
    it('should render the login page', () => {
        render(<Login/>)

        const form = screen.getByRole('form')
        const email = screen.getByLabelText('email')
        const password = screen.getByLabelText('password')
        const button = screen.getByRole('button')
        const register = screen.getByText('Register')
        const resetPassword = screen.getByText('Reset Password')

        expect(form).toBeInTheDocument();
        expect(email).toBeInTheDocument();
        expect(password).toBeInTheDocument();
        expect(button).toBeInTheDocument();
        expect(register).toBeInTheDocument();
        expect(resetPassword).toBeInTheDocument();
    })
})