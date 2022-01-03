import { render, screen } from '@testing-library/react'
import Home, { getStaticProps } from '../pages'
import { stripe } from '../services/stripe'
import { mocked } from 'ts-jest/utils'

jest.mock('next/router')

jest.mock('next-auth/client', () => {
    return {
        useSession: () => [null, false]
    }
})

jest.mock('../services/stripe')

describe('Home Page', () => {

    it('renderiza corretamente', () => {
        render(<Home product={{priceId: '1', amount: '$10.00' }} />)

        expect(screen.getByText("por $10.00 mensal")).toBeInTheDocument()
    })

    it('carrega dados iniciais em GetStaticProps', async () => {
        const pricesMocked = mocked(stripe.prices.retrieve)

        pricesMocked.mockResolvedValueOnce({
            id: 'fake',
            unit_amount: 1000,
        } as any)

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({  
                props: {
                    product: {
                        priceId: 'fake',
                        amount: '$10.00'
                    }
                }                
            })
        )
    })
})
