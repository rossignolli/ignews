import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import Posts, { getStaticProps } from '../pages/posts'
import { getPrismicClient } from '../services/prismic'

const posts = [
    { 
        slug: 'my-new-post', 
        title: 'My New Post', 
        preview: 'My New...', 
        updatedAt: "hoje" 
    }
] 

jest.mock('../services/prismic')

describe('Posts Page', () => {

    it('renderiza corretamente', () => {
        render(<Posts posts={posts} />)
        expect(screen.getByText("My New Post")).toBeInTheDocument()
    })


    it('carrega dados iniciais em GetStaticProps', async () => {
        const prismicMocked = mocked(getPrismicClient)

        prismicMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: 'my-new-post',
                        data: {
                            title: [
                                { type: 'heading', text: 'My New Post'}
                            ],
                            content: [
                                { type: 'paragraph', text: ''}
                            ]
                        },
                        last_publication_date: '05-25-2021'
                    },
                ]                
            })
        } as any)

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({  
                props: {
                    posts: [{
                        slug: 'my-new-post',
                        title: 'My New Post',
                        preview: '',
                        updatedAt: '25 de maio de 2021'
                    }]
                }                
            })
        )
    })
})
