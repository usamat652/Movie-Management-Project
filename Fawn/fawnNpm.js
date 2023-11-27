import mongoose, { connect, Schema, model } from 'mongoose';
import { init, Task } from 'fawn';
// Connect to MongoDB
connect('mongodb://localhost/fawn');
const accountSchema = new Schema({
  user: String,
  balance: Number,
});
const Account = model('Account', accountSchema);
// Initialize Fawn
init(mongoose);
//perform transaction
async function performTransaction(fromUser, toUser, amount) {
  try {
    // Start the Fawn task
    await Task()
      // Update sender  and receiver balance
      .update('accounts', { user: fromUser }, { $inc: { balance: -amount } })
      .update('accounts', { user: toUser }, { $inc: { balance: amount } })
      .run();
    console.log('Transaction successful');
  } catch (error) {
    console.error(`Transaction failed: ${error}`);
  }
}
async function main() {
  try {
   
    const initialAccounts = await Account.find();
    console.log('Initial Account Balances:');
    initialAccounts.forEach(account => {
      console.log(`${account.user}: ${account.balance}`);
    });
    // Perform a transaction
    await performTransaction('Talha', 'Burhan', 10);
    // account balance after transaction
    const updatedAccounts = await Account.find();
    console.log('\nAccount Balances after Transaction:');
    updatedAccounts.forEach(account => {
      console.log(`${account.user}: ${account.balance}`);
    });
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}
// Run the example
main();