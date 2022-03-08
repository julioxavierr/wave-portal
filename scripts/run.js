const main = async () => {
  // compile the contract and generate the artifacts
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");

  // create a local ethereum network
  const waveContract = await waveContractFactory.deploy();

  // wait until the contract is deployed
  await waveContract.deployed();

  console.log("Contract deployed to:", waveContract.address);
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
