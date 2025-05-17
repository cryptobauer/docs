---
title: Cloud Instance Guide
parent: RPC Node
nav_order: 3
---

# Detailed Cloud Instance Instructions

The following instructions detail how to set up a Taraxa lite node RPC node on a [Hetzner cloud instance](https://hetzner.cloud/?ref=hcAgRLmB7Cos) (referral link). Please note that specifications may change over time.

1. **Create** a new cloud instance with the following minimum settings:

    * **Location**: Any (some are cheaper; not all types are available everywhere)
    * **Image**: Ubuntu 24.04 or newer
    * **Type**: Dedicated vCPU (CCX23 or higher)
    * **SSH Key**: Add your SSH key if available
    * Default settings are acceptable for other options

    After creation, wait a few minutes. You will receive an email containing the IP address and SSH login details from Hetzner.

    Alternatively us any other cloud provider that offers a Linux instance with Docker support.

1. **Login** to your instance:

    ```bash
    ssh root@<IP_ADDRESS>
    ```

    Replace `<IP_ADDRESS>` with your instance's actual IP.

    ![Cloud Instance Login Screenshot](/assets/images/cloud-install-1.webp)

1. **Update** the system:

    ```bash
    sudo apt update && sudo apt upgrade
    ```

    ![Cloud Instance Update Screenshot](/assets/images/cloud-install-2.webp)

    ![Cloud Instance Upgrade Screenshot](/assets/images/cloud-install-3.webp)

1. **Install** Docker following the [Docker Engine Ubuntu repository installation guide](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository):

    ```bash
    sudo apt update
    sudo apt install ca-certificates curl
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc
    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    ```

    ![Cloud Instance Prepare Install Docker Screenshot](/assets/images/cloud-install-4.webp)

    ```bash
    sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    ```

    ![Cloud Instance Install Docker Screenshot](/assets/images/cloud-install-5.webp)

1. **Verify** Docker installation:

    ```bash
    sudo docker run hello-world
    ```

    ![Cloud Instance Verify Docker Screenshot](/assets/images/cloud-install-6.webp)

1. **Install** the Taraxa lite node:

    ```bash
    mkdir ~/mainnet
    cd ~/mainnet
    wget https://raw.githubusercontent.com/Taraxa-project/taraxa-ops/master/taraxa_compose_mainnet/docker-compose.light.yml -O docker-compose.yml
    ```

    ![Cloud Instance Download Compose YAML Screenshot](/assets/images/cloud-install-7.webp)

    ```bash
    docker compose up -d
    ```

    ![Cloud Instance Start Docker Screenshot](/assets/images/cloud-install-8.webp)

    ```bash
    docker compose logs -f -n 100 node
    ```

    ![Cloud Instance Logs Screenshot](/assets/images/cloud-install-9.webp)

    ![Cloud Instance Logs Screenshot](/assets/images/cloud-install-10.webp)

    Press `CTRL+C` to exit the logs.

1. **Validate** the RPC endpoint:

    ```bash
    curl -X POST http://localhost:7777 --data '{"jsonrpc":"2.0","method":"taraxa_getVersion","params":[],"id":1}'
    ```

    ![Cloud Instance Validate RPC Screenshot](/assets/images/cloud-install-11.webp)

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

    ![Cloud Instance Download Snapshot Screenshot](/assets/images/cloud-install-12.webp)

1. **Start** the node and **monitor** synchronization:

    ```bash
    docker compose up -d
    docker compose logs -f -n 100 node
    ```

    ![Cloud Instance Start Node Screenshot](/assets/images/cloud-install-13.webp)

    Wait for the `STATUS: GOOD. NODE SYNCED` message. (Press `CTRL+C` to exit.)

    ![Cloud Instance Start Node Synced Screenshot](/assets/images/cloud-install-14.webp)

1. **Revalidate** the RPC endpoint:

    ```bash
    curl -X POST http://localhost:7777 --data '{"jsonrpc":"2.0","method":"taraxa_getVersion","params":[],"id":1}'
    ```

    ![Cloud Instance Validate RPC Screenshot](/assets/images/cloud-install-15.webp)

1. **Optional: Test** the RPC endpoint using the provided [Javascript program](/assets/code/taraxa-rpc-test.js). This test should ideally be performed from your local laptop or desktop, not the cloud instance, to ensure the RPC endpoint is accessible externally. It requires Node.js to be installed on you local laptop or desktop.

    Replace `<IP_ADDRESS>` with your cloud instance's public IP address (see step 1.):

    ```javascript
    import { ethers } from 'ethers';

    async function printTaraxaVersion() {
        const rpcUrl = 'http://<IP_ADDRESS>:7777';
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

    ![Cloud Instance Test Program Screenshot](/assets/images/cloud-install-16.webp)

Congratulations! Your Taraxa RPC node is now installed and ready to interact with the network and your applications.
