---
title: Windows Desktop Guide
parent: RPC Node
nav_order: 2
---

# Detailed Windows Desktop Instructions

The following instructions detail how to set up a Taraxa lite node RPC node on a Windows desktop.

1. **Install** Docker Desktop by following the [installation guide](https://docs.docker.com/get-started/get-docker/).

    Download the Docker version for Windows.

    ![Windows Docker Download Screenshot](/assets/images/win-install-1.webp)

    Download either `x86_64` or `Arm` version depending on your system. Most systems are `x86_64`.

    ![Windows Docker Download Screenshot](/assets/images/win-install-2.webp)

    Install Docker Desktop by double-clicking the downloaded file.

    ![Windows Docker Install Screenshot](/assets/images/win-install-3.webp)

    ![Windows Docker Install Screenshot](/assets/images/win-install-4.webp)

    Make sure to check the box to enable WSL2 integration.

    ![Windows Docker Install Screenshot](/assets/images/win-install-5.webp)

    ![Windows Docker Install Screenshot](/assets/images/win-install-6.webp)

    If requested after the installation restart your computer.

    ![Windows Docker Install Screenshot](/assets/images/win-install-7.webp)

    Accept the license agreement.

    ![Windows Docker License Screenshot](/assets/images/win-install-8.webp)

    Use the recommended settings (except you know better).

    ![Windows Docker Settings Screenshot](/assets/images/win-install-9.webp)

    Skip the registration step (except you want to register).

    ![Windows Docker Registration Screenshot](/assets/images/win-install-10.webp)

    Wait until Docker Desktop is started.

    ![Windows Docker Start Screenshot](/assets/images/win-install-11.webp)

    Verify that it says Docker `Engine running` in the bottom left corner.

    ![Windows Docker Running Screenshot](/assets/images/win-install-12.webp)

1. **Open** a PowerShell window.

    ![Windows Install PowerShell Screenshot](/assets/images/win-install-13.webp)

1. **Install** the Taraxa lite node:

    ```powershell
    mkdir C:/mainnet
    cd C:/mainnet
    wget https://raw.githubusercontent.com/Taraxa-project/taraxa-ops/master/taraxa_compose_mainnet/docker-compose.light.yml -O docker-compose.yml
    ```

    ![Windows Install Docker Screenshot](/assets/images/win-install-14.webp)

    ```powershell
    docker compose up -d
    ```

    ![Windows Install Docker Screenshot](/assets/images/win-install-15.webp)

    Allow access if a security prompt appears.

    ![Windows Install Docker Screenshot](/assets/images/win-install-16.webp)

    ```powershell
    docker compose logs -f -n 100 node
    ```

    ![Windows Install Docker Screenshot](/assets/images/win-install-17.webp)

    Press `CTRL+C` to exit the logs.

1. **Validate** the RPC endpoint:

    ```bash
    curl -X POST http://localhost:7777 --data '{"jsonrpc":"2.0","method":"taraxa_getVersion","params":[],"id":1}'
    ```

    ![Windows Validate RPC Screenshot](/assets/images/win-install-18.webp)

1. **Install** the latest database snapshot to speed up synchronization. Note that some commands may take a while to complete:

    ```bash
    docker compose down
    docker run --rm -it -v mainnet_data:/data alpine sh
    cd /data/db
    rm -r db state_db
    wget http://snapshots.cryptobauer.com/snapshot-litenode-latest.tar.gz
    tar xzf snapshot-litenode-latest.tar.gz
    rm snapshot-litenode-latest.tar.gz
    exit
    ```

    ![Windows Install Snapshot Screenshot](/assets/images/win-install-19.webp)

1. **Start** the node and **monitor** synchronization:

    ```bash
    docker compose up -d
    docker compose logs -f -n 100 node
    ```

    ![Windows Start Node Screenshot](/assets/images/win-install-17.webp)

    Wait for the `STATUS: GOOD. NODE SYNCED` message. (Press `CTRL+C` to exit.)

    ![Windows Synced Node Screenshot](/assets/images/win-install-20.webp)

1. **Revalidate** the RPC endpoint:

    ```bash
    curl -X POST http://localhost:7777 --data '{"jsonrpc":"2.0","method":"taraxa_getVersion","params":[],"id":1}'
    ```

    ![Cloud Instance Validate RPC Screenshot](/assets/images/win-install-21.webp)

1. **Optional: Test** the RPC endpoint programmatically using the provided [Javascript program](/assets/code/taraxa-rpc-test.js). It requires Node.js to be [installed](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows#install-nvm-windows-nodejs-and-npm).

    ```javascript
    import { ethers } from 'ethers';

    async function printTaraxaVersion() {
        const rpcUrl = 'http://localhost7777';
        const provider = new ethers.JsonRpcProvider(rpcUrl);

        try {
            const version = await provider.send('taraxa_getVersion', []);
            console.log('Response from Taraxa RPC node:', version);
        } catch (error) {
            console.error('Error interacting with Taraxa RPC node:', error);
        }
    }

    printTaraxaVersion();
    ```

    Then run on your local laptop or desktop:

    ```bash
    npm install ethers
    node taraxa-rpc-test.js
    ```

    ![Cloud Instance Test Program Screenshot](/assets/images/win-install-22.webp)

Congratulations! Your Taraxa RPC node is now installed and ready to interact with the network and your applications.
