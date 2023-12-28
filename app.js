// app.js
const { generateWallet, sendSol, createTokenAccount, swapTokens, sendToken } = require('./solanaUtils');

const main = async () => {
  const wallets = [];
  const numberOfWallets = 10;

  // Generate wallets
  for (let i = 0; i < numberOfWallets; i++) {
    wallets.push(generateWallet());
  }

  // Send SOL from the first wallet to the rest
  const senderWallet = wallets[0];
  const solToSend = 1000000; // Adjust the amount as needed

  for (let i = 1; i < numberOfWallets; i++) {
    const recipientAddress = wallets[i].publicKey;
    await sendSol(senderWallet, recipientAddress, solToSend);
  }

  // Create a token mint (assuming you have a token mint address)
  const tokenMintAddress = 'YOUR_TOKEN_MINT_ADDRESS';
  const tokenMintOwnerWallet = generateWallet();
  const tokenAccount = await createTokenAccount(tokenMintOwnerWallet, tokenMintAddress);

  // Swap tokens and send to another wallet
  const destinationWallet = generateWallet();
  const amountToSwap = 10; // Adjust the amount as needed

  await swapTokens(senderWallet, tokenAccount, destinationWallet.publicKey, amountToSwap);
  await sendToken(senderWallet, tokenAccount, destinationWallet.publicKey, amountToSwap);
};

main();
