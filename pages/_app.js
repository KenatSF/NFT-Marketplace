import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className='border-b p-6'>
        <p className='text-4xl font-bold'>NFT market-place</p>
        <Link href="/"><a className='mr-4 text-cyan-800'>Home</a></Link>
        <Link href="/create-nft"><a className='mr-6 text-cyan-800'>Create NFT</a></Link>
        <Link href="/my-assets"><a className='mr-6 text-cyan-800'>My NFT</a></Link>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
