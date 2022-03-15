const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();

  // compile the contract and generate the artifacts
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");

  // create a local ethereum network
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });

  // wait until the contract is deployed
  await waveContract.deployed();

  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by:", owner.address);

  // Get contract balance
  const initialContractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(initialContractBalance)
  );

  const initialWaveCount = await waveContract.getTotalWaves();
  console.log(initialWaveCount.toNumber());

  // Send wave
  const waveTxn = await waveContract.wave("A message!");
  await waveTxn.wait(); // Wait for the transaction to be mined

  // Get Contract balance to see what happened!
  const contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

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
