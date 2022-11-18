/* eslint-disable no-implied-eval */
/* eslint-disable react-hooks/rules-of-hooks */
import {ethers} from "ethers";
import { toaster } from "evergreen-ui";
import { heritageAddress, heritageAbi } from "./contract";

export async function addTokens(tokens) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const heritage = new ethers.Contract(heritageAddress, heritageAbi, signer);
  try {
    console.log(tokens);
    // Add tokens to Heritage
    const tx = await heritage.addTokens(tokens);
    // await tx.wait();
    return true
  } catch (error) {
    console.log(error);
    toaster.danger("An error occured!");
    return false;
  }
}

export async function createHeritage(heir, checkInterval) {
  try{
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const heritage = new ethers.Contract(heritageAddress, heritageAbi, signer);
    const tx = await heritage.create(heir, checkInterval);
    await tx.wait;
    return true;
  } catch (err) {
    console.log(err)
    toaster.danger('Could not create heritage');
    return false
  }
}

export async function checkIn() {
  try{
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const heritage = new ethers.Contract(heritageAddress, heritageAbi, signer);
    const tx = await heritage.checkIn();
    // await tx.wait();
  } catch (err) {
    console.log(err)
    toaster.danger('An error occured!');
  }
}

export const hasHeritage = async(address) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const heritage = new ethers.Contract(heritageAddress, heritageAbi, provider);
  return (await heritage.hasHeritage(address));
}

export async function connect() {
  if(window.ethereum) {
    try {
      // check if the chain to connect to is installed
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }], // chainId must be in hexadecimal numbers
      });
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask
      // if it is not, then install it into the user MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x13881',
                chainName: 'Polygon testnet',
                nativeCurrency: {
                  name: 'Polygon token',
                  symbol: 'MATIC', // 2-6 characters long
                  decimals: 18
                },
                blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
                rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
          toaster.danger('failed to add network to metamask');
          return;
        }
      } else {
        console.log(error);
        toaster.danger('failed to switch network to Polygon mumbai testnet')
        return;
      }
    }
      if(window.confirm("Are you sure you want to connect your wallet. This would let Heritage see your wallet address and account balance")) {
        const accounts = await window.ethereum
          .request({ method: 'eth_requestAccounts' })
          localStorage.removeItem('isDisconnected')
          return accounts[0];
      }
    }
}


export const disconnect = () => {
  localStorage.setItem("isDisconnected", "true");
}

export const isDisconnected = () => {
  if (localStorage.getItem('isDisconnected')) {
    return true
  } else {
    return false
  }
}

export async function checkConnection() {
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts[0];
  } catch (error) {
    console.log(error)
  }
}

const getUserInterval = async() => {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const heritage = new ethers.Contract(heritageAddress, heritageAbi, signer);
          const userAddress = await signer.getAddress();
          //TODO
          //Display loader
            const res = await heritage.getHeritage(userAddress);
            console.log(res);
              const heir = res[0];
              //Convert lastSeen to minutes (just for the sake of demo)
              let ls = Math.floor( ((Number(new Date()) / 1000) - Number(res[3])) / (3600 * 24) );
              const lastSeen = ls == 0 ? "Today" : `${ls} days ago`;
              //Convert checkInterval to seconds (just for the sake of demo)
              const secs = Number(res[4]);
              const intervalMins = Math.floor(secs / (3600 * 24));
              const interval = `Every ${intervalMins} days`;
              return {heir, lastSeen, interval};
        } catch (error) {
          toaster.danger('An error occured!')
          return;
        }
};

export default getUserInterval;