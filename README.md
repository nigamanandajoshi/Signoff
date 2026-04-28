# Signoff

Signoff is a Jupiter-first Solana review layer that simulates swaps, decodes transaction intent, and gives users a clear approval brief before they sign.

## Status

`Frontier MVP in progress`

Current public focus:

- review a Jupiter swap before signing
- simulate expected execution
- decode route and instruction context
- summarize token flows, fees, slippage, and risk
- generate a shareable approval brief for signers and teammates

## Problem

Solana swaps are fast and composable, but signing is still often based on partial context.

For advanced users, treasury operators, and multisig signers, a single Jupiter swap can hide complexity across routing, slippage, setup instructions, cleanup instructions, unfamiliar tokens, and irreversible execution. Wallet warnings help, but they do not provide a dedicated high-confidence review workflow for Jupiter swaps or signer coordination.

## Solution

Signoff turns an opaque Jupiter swap into an approval packet.

The MVP will:

- ingest a Jupiter swap request or transaction payload
- simulate the swap path with Solana RPC
- decode route and instruction context
- summarize expected token inputs, outputs, fees, slippage, and route complexity
- flag basic risk conditions
- generate a plain-English review brief before the user signs

Signoff is intentionally:

- non-custodial
- read-first
- human-in-the-loop
- narrow in scope for the first release

## Why This Wedge

Generic transaction safety is not the strongest wedge because wallet previews and security tooling already exist.

The sharper opportunity is workflow:

- treasury and multisig signers who need a clearer pre-sign review step
- Jupiter power users making higher-value or more complex swaps
- teams that currently pass around screenshots, quotes, and wallet prompts in chat

Signoff is not trying to replace wallets. It is trying to improve decision quality right before approval.

## MVP Scope

### In Scope

- Jupiter swap input or payload review
- route detail extraction
- Solana RPC simulation
- expected token flow summary
- slippage and fee summary
- setup and cleanup instruction visibility
- basic risk flags
- shareable approval brief

### Out Of Scope

- custody
- auto-signing
- autonomous execution
- generic support for every Solana transaction type in v1

## Roadmap

- April 30, 2026: Jupiter review flow and route detail display
- May 4, 2026: simulation, plain-English summaries, and risk flags
- May 8, 2026: shareable approval brief and UX polish
- May 11, 2026: MVP ship, demo packaging, and Frontier submission

Detailed docs:

- [Architecture](docs/architecture.md)
- [Roadmap](docs/roadmap.md)

## Colosseum Snapshot

Current internal assessment for this wedge:

- crowdedness: `medium`
- gap type: `partial_gap`
- recommendation: `narrow-go`

Public crowdedness asset:

- https://drive.google.com/file/d/1pyrQZXzWuz-uqsAulQJTxAa1AnIUDvKN/view?usp=share_link

## Builder Proof

- [SolanaTokenLaunchPad](https://github.com/nigamanandajoshi/SolanaTokenLaunchPad)
- [ParamOS-FromScratch](https://github.com/nigamanandajoshi/ParamOS-FromScratch)
- [MedChain-FL](https://github.com/nigamanandajoshi/MedChain-FL)

## Contact

- X: https://x.com/Nigam_Xo6
- Telegram: https://t.me/Nigam256
- GitHub: https://github.com/nigamanandajoshi
