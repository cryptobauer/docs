---
title: Generic Install Guide
parent: RPC Node
nav_order: 1
---

# Detailed Generic Instructions

The following instructions detail how to set up a Taraxa lite node RPC. The instructions cover common operating systems that support Docker.

For specific instructions and examples for Windows Desktop or a Ubuntu Cloud Instance, refer to the respective guides: [Windows Desktop]({% link docs/rpc/guide-windows-desktop.md %}) and [Cloud Instance]({% link docs/rpc/guide-cloud-instance.md %}).

## Install Docker

The first step is installing Docker, if it isn't already installed. Follow the [Docker Desktop](#docker-desktop) for Desktop installations or the [Docker Engine](#docker-engine) for server installations.

### Docker Desktop

For systems with a graphical interface (e.g., home desktops), follow the [Docker Desktop installation guide](https://docs.docker.com/get-started/get-docker/).

#### WSL (Windows Subsystem for Linux)

During Docker Desktop installation on Windows, you may be prompted to install WSL. It is recommended to do so. Alternatively, install it manually by running `wsl --install` in an Administrator PowerShell session. WSL is required to be installed.

### Docker Engine

For servers without a GUI or users preferring command-line tools, follow the [Docker Engine installation guide](https://docs.docker.com/engine/install/).

## Install Taraxa Node

The following steps set up the Taraxa node using the command shell:

1. **Open** a command shell:

    * Windows: PowerShell or WSL
    * Linux/macOS: Terminal

1. **Create** a new folder `mainnet`:

    * Windows: `mkdir C:/mainnet` (PowerShell) or `mkdir /mnt/c/mainnet` (WSL)
    * Linux/macOS: `mkdir ~/mainnet`

1. **Navigate** to the `mainnet` folder:

    * Windows: `cd C:/mainnet` (PowerShell) or `cd /mnt/c/mainnet` (WSL)
    * Linux/macOS: `cd ~/mainnet`

1. **Download** the Taraxa [**lite** node]({% link docs/rpc/index.md %}#node-type-selection) Docker Compose file:

    ```bash
    wget https://raw.githubusercontent.com/Taraxa-project/taraxa-ops/master/taraxa_compose_mainnet/docker-compose.light.yml -O docker-compose.yml
    ```

    or for a [**full** node]({% link docs/rpc/index.md %}#node-type-selection):

    ```bash
    wget https://raw.githubusercontent.com/Taraxa-project/taraxa-ops/master/taraxa_compose_mainnet/docker-compose.yml -O docker-compose.yml
    ```

1. **Start** the Taraxa node:

    ```bash
    docker compose up -d
    ```

1. **Optional: Validate** that the node is running:

    ```bash
    docker compose logs -f -n 100 node
    ```

    (Press `CTRL+C` to exit.)

1. **Optional: Validate** the RPC endpoint:

    * Windows (PowerShell):

        ```bash
        curl -Uri http://localhost:7777 -Method Post -Headers @{ "Content-Type" = "application/json" } -Body '{"jsonrpc":"2.0","method":"taraxa_getVersion","params":[],"id":1}'
        ```

    * Linux/macOS or WSL:

        ```bash
        curl -X POST http://localhost:7777 --data '{"jsonrpc":"2.0","method":"taraxa_getVersion","params":[],"id":1}'
        ```

If the command returns a JSON string with a version field (e.g., `1.13.1`), your node is successfully running.

Next, install the latest [database snapshot](#install-database-snapshot-recommended) to speed up synchronization.

## Install Database Snapshot (Recommended)

Installing a snapshot significantly accelerates the initial sync.

1. **Stop** the running node:

    ```bash
    docker compose down
    ```

1. **Mount** the data volume:

    ```bash
    docker run --rm -it -v mainnet_data:/data alpine sh
    ```

1. **Navigate** to the database directory:

    ```bash
    cd /data/db
    ```

1. **Remove** the existing database:

    ```bash
    rm -r db state_db
    ```

1. **Download** the latest **lite** node snapshot if [previously selected](#install-taraxa-node):

    ```bash
    wget http://snapshots.cryptobauer.com/snapshot-litenode-latest.tar.gz
    ```

    or **full** node snapshot:

    ```bash
    wget https://storage.googleapis.com/taraxa-snapshot/snapshot.tar.gz
    ```

1. **Extract** the snapshot:

    ```bash
    tar xzf snapshot-litenode-latest.tar.gz
    ```

1. **Delete** the downloaded archive:

    ```bash
    rm snapshot-litenode-latest.tar.gz
    ```

1. **Exit** the container:

    ```bash
    exit
    ```

1. **Start** the node:

    ```bash
    docker compose up -d
    ```

1. **Monitor** synchronization:

    ```bash
    docker compose logs -f -n 100 node
    ```

    Wait for the log message `STATUS: GOOD. NODE SYNCED`, indicating the node is fully synced and ready. (Press `CTRL+C` to exit.)

1. **Revalidate** the RPC endpoint:

    * Windows (PowerShell):

        ```bash
        curl -Uri http://localhost:7777 -Method Post -Headers @{ "Content-Type" = "application/json" } -Body '{"jsonrpc":"2.0","method":"taraxa_getVersion","params":[],"id":1}'
        ```

    * Linux/macOS or WSL:

        ```bash
        curl -X POST http://localhost:7777 --data '{"jsonrpc":"2.0","method":"taraxa_getVersion","params":[],"id":1}'
        ```

## Test Program

The following simple [Javascript program](/assets/code/taraxa-rpc-test.js) can verify the RPC endpoint programmatically. Node.js must be installed. If the script is executed on a different machine than the node, ensure the RPC endpoint URL is changed to the node's public IP address instead of `localhost`.

```javascript
import { ethers } from 'ethers';

async function printTaraxaVersion() {
    const rpcUrl = 'http://localhost:7777';
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

To run:

1. Save the code in a file named `taraxa-rpc-test.js`.
2. Install dependencies and run the script:

```bash
npm install ethers
node taraxa-rpc-test.js
```

Successful output will look like:

```text
Response from Taraxa RPC node: {
  git_branch: '',
  git_commit_date: 'Tue, 8 Apr 2025 17:33:09 +0200',
  git_commit_hash: 'cdba692488ed9feab87637cb5f2520f01322c3f8',
  git_description: 'v1.12.15-31-gcdba69248',
  version: '1.13.1'
}
```
