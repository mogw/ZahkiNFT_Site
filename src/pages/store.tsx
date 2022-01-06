import Head from 'next/head'

import { Toaster } from 'react-hot-toast';
import SubHeader from '../components/sub-header';
import StoreItem from '../components/store-item';
import { useWindowSize } from '../hooks/use-window-size';

const Store = () => {

    const {width, height} = useWindowSize();

    return (
        <div>
            <Toaster />
            <Head>
                <title>Gorilla Galaxy</title>
                <meta name="description" content="Genesis is a collection of 4444 unique, randomly generated Gorillas roaming on the Solana blockchain." />
                <link rel="icon" href="/icon.png" />
            </Head>
    
            <SubHeader title="$GLUE STORE" />

            <section>
                <div className="w-full flex justify-center items-center">
                    <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-8 px-5 md:px-10 py-8">
                        <StoreItem image="/images/store.png" title="3D Gorilla" price="???" />
                        <StoreItem image="/images/store.png" title="???" price="???" />
                        <StoreItem image="/images/store.png" title="???" price="???" />
                        <StoreItem image="/images/store.png" title="???" price="???" />
                        <StoreItem image="/images/store.png" title="???" price="???" />
                        <StoreItem image="/images/store.png" title="???" price="???" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Store;
