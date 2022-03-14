const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();

  // compile the contract and generate the artifacts
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");

  // create a local ethereum network
  const waveContract = await waveContractFactory.deploy();

  // wait until the contract is deployed
  await waveContract.deployed();

  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by:", owner.address);

  const initialWaveCount = await waveContract.getTotalWaves();
  console.log(initialWaveCount.toNumber());

  const firstWaveTxn = await waveContract.wave("A message!");
  await firstWaveTxn.wait(); // Wait for the transaction to be mined

  const secondWaveTxn = await waveContract
    .connect(randomPerson)
    .wave("Another message!");
  await secondWaveTxn.wait(); // Wait for the transaction to be mined

  const allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
};

(async () => {
  try {
    await main();
    process.exit(0); // exit Node process without error
  } catch (error) {
    console.log(error);
    process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
  }
})();
