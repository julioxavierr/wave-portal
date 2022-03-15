import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import { abi } from "./utils/WavePortal.json";

const CONTRACT_ADDRESS = "0xE4E783eEc77Ff3fe9E48A2704E4bCA01097e1f53";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState("");

  /** Get current account/wallet */
  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        const { ethereum } = window;

        if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
        } else {
          console.log("We have the ethereum object", ethereum);
        }

        // Check if we're authorized to access the user's wallet
        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found");
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkIfWalletIsConnected();
  }, []);

  /** Get all waves for the current contract */
  useEffect(() => {
    // Skip if wallet is not connected
    if (!currentAccount) return;

    const getAllWaves = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const wavePortalContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            abi,
            signer
          );

          const waves = await wavePortalContract.getAllWaves();

          const sanitizedWaves = waves.map((wave) => ({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          }));

          setAllWaves(sanitizedWaves);
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAllWaves();
  }, [currentAccount]);

  const handleConnectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleWave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          abi,
          signer
        );

        const initialCount = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", initialCount.toNumber());

        // Execute the actual wave from your smart contract
        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        const count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        setMessage("");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there!</div>

        <div className="bio">Connect your Ethereum wallet and wave at me!</div>

        {currentAccount ? (
          <>
            <div className="waveContainer">
              <input
                className="waveInput"
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value || "")}
              />
              <button className="waveButton" onClick={handleWave}>
                Wave at Me
              </button>
            </div>
            <div>
              {allWaves.map((wave, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "OldLace",
                    marginTop: "16px",
                    padding: "8px",
                  }}
                >
                  <div>Address: {wave.address}</div>
                  <div>Time: {wave.timestamp.toString()}</div>
                  <div>Message: {wave.message}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <button className="waveButton" onClick={handleConnectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
