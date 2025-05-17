---
title: RPC Node
nav_order: 1
---

# Taraxa RPC Node Setup Guide

A Taraxa RPC node is a validator node configured not to participate in consensus (unless desired). Its main purpose is to provide a JSON-RPC interface to the Taraxa network, enabling developers to interact with the blockchain and build applications.

A [generic install guide]({% link docs/rpc/guide-generic.md %}) is provided and also a step-by-step install guide for [Windows Desktop]({% link docs/rpc/guide-windows-desktop.md %}) and a [Ubuntu Cloud Instance]({% link docs/rpc/guide-cloud-instance.md %}).

## Node Type Selection

Taraxa offers two types of nodes: **full** nodes and **lite** nodes. Lite nodes are ideal for RPC purposes due to their lightweight nature and reduced disk space requirements. However, they only retain one day of historical data, which may not suffice for applications needing access to older blockchain history. For such use cases, a full node is recommended as it maintains the complete blockchain history. If in doubt begin with a lite node and switch to a full node later if your application performance is insufficient.

## Hardware Selection

Lite nodes are resource-friendly and can run in various environments. Taraxa recommends using Docker images for installation. Any environment capable of running Docker should suffice, provided it meets the minimum [hardware requirements](https://docs.taraxa.io/become-a-validator/consensus-node-hardware-requirements#lite-consensus-node).

Common hosting environments include:

### Desktop Computer

Some validators run nodes from home desktop machines. While hardware is usually sufficient, ensure you have adequate network bandwidth. Running a node from home is ideal for initial testing and experimentation.

### Cloud Instance

The most common long-term solution is renting a lightweight and cheap cloud instance from a provider with semi-dedicated resources.

### Virtual Private Server (VPS)

Similar to a cloud instance, a VPS is a virtual machine hosted on a physical server that is shared with others. It offers dedicated virtual resources and is often more cost-effective than [dedicated servers](#dedicated-server-bare-metal).

### Dedicated Server (Bare Metal)

Dedicated servers are physical machines hosted in data centers. They offer dedicated resources, making them more predictable in terms of resources. However, they are typically more expensive and difficult to maintain.

## Operating System Selection

Any operating system that supports Docker can run a Taraxa node. Practically, this is usually limited to Windows, Linux, and macOS. Linux and Windows receive the most community support.

When ordering a cloud instance or server, providers usually offer pre-installed operating systems. Linux distributions (especially Ubuntu) are most common and often free of licensing fees, whereas Windows may incur extra costs.

If unsure, choose Ubuntu Linux due to its ease of use, widespread community support, and compatibility with available tools.
