import { ethers } from 'ethers';

async function printTaraxaVersion() {
    const rpcUrl = 'https://rpc.mainnet.taraxa.io';
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    try {
        const version = await provider.send('taraxa_getVersion', []);
        console.log('Response from Taraxa RPC node:', version);
    } catch (error) {
        console.error('Error interacting with Taraxa RPC node:', error);
    }
}

printTaraxaVersion();
