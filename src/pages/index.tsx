
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { stripe } from '../services/stripe';
import { SubscribeButton } from '../SubscribreButton';
import styles from './home.module.scss'

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({product}: HomeProps) {

 

  return (
    <>
    <Head>
       <title>Home - ig.news</title>
    </Head>
    <main className={styles.contentContainer}>
      <a href=""  >Temos novas ofertas</a>
      <div className={styles.pageWarning}>
        <a className={styles.wrap} href="<?php echo $this->url; ?>"><i data-icon="mdi-refresh"></i> Ver notícias mais recentes. </a>
      </div>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="girl coding." />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () =>{

  const price = await stripe.prices.retrieve('price_1IzgR0DV4jJihp4LswZuyYOM', {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };


  return {
    props: {
      product
    }
  }
}
