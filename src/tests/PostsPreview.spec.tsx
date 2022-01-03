import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

import Post, { getStaticProps } from '../pages/posts/preview/[slug]'
import { getPrismicClient } from '../services/prismic'
import { getServerSideProps } from '../pages/posts/[slug]'

const post = { 
    slug: 'my-new-post', 
    title: 'My New Post', 
    content: '<p>Lorem ipsum</p>', 
    updatedAt: "10 de abril" 
}

jest.mock('next-auth/client')
jest.mock('next/router')
jest.mock('../services/prismic')

describe('Post Preview Page', () => {

    it('renderiza corretamente', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false])

        render(<Post post={post} />)

        expect(screen.getByText("My New Post")).toBeInTheDocument()
        expect(screen.getByText("Lorem ipsum")).toBeInTheDocument()
        expect(screen.getByText("Deseja continuar lendo?")).toBeInTheDocument()        
    })

    it('redireciona para post completo se usuário estiver autenticado', async () => {
        const useSessionMocked = mocked(useSession)
        const userRouterMocked = mocked(useRouter)
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce([
            { activeSubscription: 'fake' }, false
        ] as any)

        userRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<Post post={post} />)
        
        expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')        
    })

    it('carrega dados iniciais', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient)
                
        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        {type: 'heading', text: 'Post'}                    
                    ],
                    content: [
                        {type: 'paragraph', text: 'Post'}
                    ]
                },
                last_publication_date: '04-01-2021'
            })
        } as any)
        
        const response = await getStaticProps({
            params: { slug: 'my-new-post'}
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: 'Post',
                        content: '', //<p>Post content</p>',
                        updatedAt: '01 de abril de 2021'
                    }
                }
            })
        )
    })
})
