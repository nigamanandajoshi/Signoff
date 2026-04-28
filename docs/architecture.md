# Signoff Architecture

## Product Shape

Signoff is a read-first transaction review layer for Solana, starting with Jupiter swaps.

The first version has one core job:

1. accept a Jupiter swap payload or swap context
2. simulate the expected execution path
3. decode route and instruction details
4. summarize the result in plain English
5. surface risk signals before the user signs

## Core Components

### 1. Frontend

Responsibilities:

- accept swap input or pasted payload
- render route details and token flow
- show plain-English approval brief
- display warnings, fees, and slippage
- generate a shareable review view

Suggested stack:

- Next.js
- TypeScript

### 2. Jupiter Integration Layer

Responsibilities:

- normalize quote and route data
- extract route labels and path details
- map Jupiter-specific fields into Signoff review objects

### 3. Simulation Layer

Responsibilities:

- call Solana RPC simulation endpoints
- capture expected execution metadata
- surface setup and cleanup actions that are easy to miss in wallets

### 4. Risk Heuristics Layer

Initial checks:

- suspicious or unfamiliar token
- high slippage
- route complexity
- large value relative to wallet balance
- extra setup or cleanup instructions

This layer should stay explainable. The first version should prefer simple rules over opaque scoring.

### 5. Approval Brief Generator

Output:

- what the user is swapping
- what they are expected to receive
- route summary
- fees and slippage
- warnings
- final human-readable verdict context

## Non-Goals For V1

- custody
- auto-execution
- approval policy enforcement onchain
- generalized support for every Solana transaction type
- institutional audit claims

## Design Principle

If the product cannot explain the swap clearly in one screen, it has failed the MVP.
