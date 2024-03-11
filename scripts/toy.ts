import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

const main = async () => {
  // this script is left here to toy around with various libraries,
  // functions, etc.
  // if something is wrong and you need a place to poke
  // at your code, this is it.
};

main().then(() => {
  console.log('test done');
  process.exit();
});
