// solanaUtils.js
const { Keypair, Connection, SystemProgram, Transaction, PublicKey } = require('@solana/web3.js');

const generateWallet = () => {
  const keypair = Keypair.generate();
  return {
    publicKey: keypair.publicKey.toString(),
    privateKey: keypair.secretKey.toString(),
  };
};

const sendSol = async (senderWallet, recipientAddress, amount) => {
  const connection = new Connection('https://api.devnet.solana.com');

  const senderKeyPair = Keypair.fromSecretKey(new Uint8Array(senderWallet.privateKey));
  const recipientPublicKey = new PublicKey(recipientAddress);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderKeyPair.publicKey,
      toPubkey: recipientPublicKey,
      lamports: amount,
    })
  );

  const signature = await window.solana.request({
    method: 'signTransaction',
    params: {
      message: transaction.serializeMessage(),
    },
  });

  transaction.addSignature(senderKeyPair.publicKey, Buffer.from(signature.signature));

  const result = await connection.sendTransaction(transaction, [senderKeyPair]);

  return result;
};

module.exports = { generateWallet, sendSol };

// solanaUtils.js (continued)
const { Token, TOKEN_PROGRAM_ID, TokenInstructions } = require('@solana/spl-token');

const createTokenAccount = async (owner, mintAddress) => {
  const connection = new Connection('https://api.devnet.solana.com');
  const payerKeyPair = Keypair.fromSecretKey(new Uint8Array(owner.privateKey));
  const mintPublicKey = new PublicKey(mintAddress);

  const tokenAccount = new Keypair();

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payerKeyPair.publicKey,
      newAccountPubkey: tokenAccount.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(165),
      space: 165,
      programId: TOKEN_PROGRAM_ID,
    }),
    Token.createInitAccountInstruction(
      TOKEN_PROGRAM_ID,
      mintPublicKey,
      tokenAccount.publicKey,
      payerKeyPair.publicKey
    )
  );

  await connection.sendTransaction(transaction, [payerKeyPair, tokenAccount]);

  return tokenAccount.publicKey.toString();
};

const swapTokens = async (sourceWallet, sourceTokenAccount, destinationTokenAccount, amount) => {
  // Implement token swap logic here
  // Note: This depends on the specific token swap implementation you are using
  // Refer to the token swap documentation for details
};

const sendToken = async (senderWallet, senderTokenAccount, recipientAddress, amount) => {
  // Implement token transfer logic here
  // Note: This depends on the specific token transfer implementation you are using
  // Refer to the token transfer documentation for details
};

module.exports = { generateWallet, sendSol, createTokenAccount, swapTokens, sendToken };
