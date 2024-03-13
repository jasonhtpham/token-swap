# Token Swap - SChare

## Background

This project is the use case to demonstrate how to develop blockchain application by leveraging the SChare platform.

SChare is a platform built based on a framework that offers smart contract creation as a service. The platform aims to allow general software engineers to develop blockchain applications without the need to acquire deep blockchain expertise. Smart contract creation services on the platform are documented with guidelines and instructions for developers to consume.

## Cross-chain Token Swap

At the simplest level of explanation, cross-chain token swap refer to an exchange of a token on one blockchain network for its equivalent on another blockchain network.

For example, Alice has a CryptoKitty NFT on Ethereum, she wants to send it to Bob as a gift, but Bob's wallet is on Algorand blockchain and he only use one wallet. Therefore, Alice needs to perform a cross-chain swap to exchange her Ethereum CryptoKitty NFT for an equivalent Algorand CryptoKitty NFT before sending it to Bob.

## Services

The Token Swap application provide the ability to perform swap of Non-Fungible Tokens (NFTs) between blockchain networks. In this example, we would like to demonstrate the swap between Ethereum <> Algorand. Therefore, it utilizes 2 available services on [SChare](https://baas-db.fly.dev/service): NFT (Algorand) and NFT (Ethereum).
