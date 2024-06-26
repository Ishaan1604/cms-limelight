import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { it, expect, describe } from 'vitest'
import React from 'react';
import '@testing-library/jest-dom/vitest';
import { Home, Claims, MakeClaim, NavBar, Policies, Policy, UserPolicies } from '../../../pages/user';

describe('Testing the home component', () => {
    it('renders all the major elements', () => {
        render(
            <Home/>
        )

        expect(screen.getByRole('link', { name: '/mockName/i' })).toBeInDocument()
        expect(screen.getByRole('link', { name: '/mockName/policies' })).toBeInDocument()
        expect(screen.getByRole('link', { name: '/mockName/myPolicies' })).toBeInDocument()
        expect(screen.getByRole('link', { name: '/mockName/claims' })).toBeInDocument()
        expect(screen.getByText('Logout')).toBeInDocument()
        expect(screen.getByText('Welcome!')).toBeInDocument()
        expect(screen.getByText('mockName')).toBeInDocument()
        expect(screen.getByText('User Info')).toBeInDocument()
        expect(screen.getByText('My Policy Updates')).toBeInDocument()
        expect(screen.getByText('Policy Updates')).toBeInDocument()
        expect(screen.getByText('My Claims Update')).toBeInDocument()
    })

    it('the change being implemented in the form', () => {
        render(
            <Home/>
        )

        const nameInput = screen.getByLabelText('name');
        fireEvent.change(nameInput, { target: { value: 'newName' } })

        expect(nameInput.value).toBe('newName')
    })

    it('the update user button', async () => {
        render(
            <Home/>
        )

        const updateUser = screen.getByLabelText('Update User');
        fireEvent.click(updateUser)

        await waitFor(() => {
            expect(localStorage.setItem).toBeCalledWith('name', 'updatedName')
            expect(localStorage.setItem).toBeCalledWith('email', 'updatedEmail')
            expect(localStorage.setItem).toBeCalledWith('token', 'updatedToken')
            expect(screen.getByLabelText('name').value).toBe('updatedName')
            expect(screen.getByLabelText('email').value).toBe('updatedEmail')
        })
    })

    it('the delete user button', async () => {
        render(
            <Home/>
        )

        const deleteUser = screen.getByLabelText('Delete User');
        fireEvent.click(deleteUser)

        await waitFor(() => {
            expect(localStorage.removeItem).toBeCalledWith('name')
            expect(localStorage.removeItem).toBeCalledWith('email')
            expect(localStorage.removeItem).toBeCalledWith('role')
            expect(localStorage.removeItem).toBeCalledWith('token')
            expect(screen.getByText('Login')).toBeInDocument();
        })
    })

    it('navigation to login in case of no token', async () => {
        localStorage.getItem.mockResolvedValueOnce(null)

        render(
            <Home/>
        )

        await waitFor(() => {
            expect(screen.getByText('Login')).toBeInDocument();
        })
    })

    it('the loading screen', () => {

        render(
            <Home/>
        )

        expect(screen.getByText('Loading')).toBeInDocument();
    })

    it('the error handling', async () => {
        render(
            <Home/>
        )

        await waitFor(() => {
            expect(screen.getByText('Something went wrong')).toBeInDocument();
        })
    })

    it('the fetch function', async () => {
        axiosMock.get
            .mockResolvedValueOnce({
                data: { policies: [] }
            })
            .mockResolvedValueOnce({
                data: { myPolicies: [{ id: 1, policyName: 'Example 1', expired: 'true', updatedAt: 'today' }, { id: 2, policyName: 'Example 2', expired: 'true', updatedAt: 'yesterday' }, { id: 3, policyName: 'Example 3', expired: 'false', updatedAt: 'today', createdAt: 'today' }] }
            })
            .mockResolvedValueOnce({
                data: { claims: [{ id: 1, policyName: 'Example 1', status: 'rejected' }, { id: 2, policyName: 'Example 2', status: 'accepted' }, { id: 3, policyName: 'Example 3', status: 'pending', updatedAt: 'today', createdAt: 'today' }] }
            })

        render(
            <Home/>
        )

        await waitFor(() => {
            expect(screen.getByText('No Policy Updates')).toBeInDocument();
            expect(screen.getByText('Your policy: Example 1 expired on today')).toBeInDocument();
            expect(screen.getByText('Your policy: Example 2 expired on yesterday')).toBeInDocument();
            expect(screen.getByText('New user-policy added: Example 3')).toBeInDocument();
            expect(screen.getByText('Claim for Example 1 rejected')).toBeInDocument();
            expect(screen.getByText('Claim for Example 2 accpeted')).toBeInDocument();
            expect(screen.getByText('New claim added: Example 3')).toBeInDocument();
        })
    })
})