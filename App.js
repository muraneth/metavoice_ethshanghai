import React, { useEffect, useRef } from 'react';
import './App.css';
import alanBtn from "@alan-ai/alan-sdk-web";
import { Box, Button, Flex, Spacer } from '@chakra-ui/react';
import { useState } from 'react';
import { connectWallet } from './utils/connectWallet';
import { ChakraProvider } from '@chakra-ui/react'
import Web3 from 'web3';
import { Text } from "@chakra-ui/react"

let alanBtnInstance;

function App() {
  const alanBtnContainer = useRef();
  const logoEl = useRef();
  const web3 = new Web3(Web3.givenProvider || 'https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY');
  const [walletAddress, setWalletAddress] = useState('');
  const [showWalletAddress, setshowWalletAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const name2addr = {
    'BOYU': '0x7e106F7951E73e513641cCF154C34aEBc986DE11',
    'BOB': '0x57b8AeEcD8a396856C64ffcB442d13CA382e6Ce4',
    'ALICE': '0x15a0c85082301573B1664586d101CAF2fF86bC8B',
    'DAVID': '0xae26fC8A9A3396a309e57963834457681f473C2D'
  };
  const sendTransaction = async (fromAddress, toAddress, amount) => {
    try {
      const ethAmount = web3.utils.toWei(amount, 'ether');
      const gasPrice = await web3.eth.getGasPrice();
      const nonce = await web3.eth.getTransactionCount(fromAddress);

      const txObject = {
        from: fromAddress,
        to: toAddress,
        value: web3.utils.toHex(ethAmount),
        gas: web3.utils.toHex(21000),
        gasPrice: web3.utils.toHex(gasPrice),
        nonce: web3.utils.toHex(nonce),
      };

      web3.eth.sendTransaction(txObject)
          .on('transactionHash', (hash) => {
            console.log('Transaction hash:', hash);
          })
          .on('error', (error) => {
            console.error('Error while sending transaction:', error);
          });
    } catch (error) {
      console.error('Error while sending transaction:', error);
    }
  };

  const getBalance = async (address) => {
    try {
      const balanceWei = await web3.eth.getBalance(address);
      const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
      await alanBtnInstance.activate();
      alanBtnInstance.playText("Your balance is " + balanceEther);
      return balanceEther;
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  };


  const handleWalletConnection = async () => {
    try {
      // 请求用户连接钱包
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const connectedAddress = accounts[0];
      if (connectedAddress) {
        setWalletAddress(connectedAddress);
        setshowWalletAddress(connectedAddress.slice(0, 8));
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const wordToNumber = (word) => {
    switch (word) {
      case 'one':
        return '1';
      case 'two':
        return '2';
      case 'three':
        return '3';
      case 'four':
        return '4';
      case 'five':
        return '5';
      case 'six':
        return '6';
      case 'seven':
        return '7';
      case 'eight':
        return '8';
      case 'nine':
        return '9';
      default:
        return word;
    }
  }

  useEffect(() => {
    alanBtnInstance = alanBtn({
      key: '6932264d60faff321df2cf65585586e22e956eca572e1d8b807a3e2338fdd0dc/stage',
      rootEl: alanBtnContainer.current,
      onCommand: (commandData) => {
        console.log(commandData);
        if (commandData.command === 'transfer') {
         
          let fromUser = commandData.data.fromUser;
          let toUser = commandData.data.toUser;
          let num = wordToNumber(commandData.data.num);
          console.log(name2addr[fromUser.toUpperCase()], name2addr[toUser.toUpperCase()], num);
          sendTransaction(name2addr[fromUser.toUpperCase()], name2addr[toUser.toUpperCase()], num);

          console.log("fromUser", fromUser);
          console.log(commandData.data);
        }
        if (commandData.command === 'checkBalance') {
          console.log(commandData.data);
          let user = commandData.data.user;
          getBalance(name2addr[user.toUpperCase()]);
        }
      }
    });
  }, []);

  return (
    <ChakraProvider>
      <div className="App">

        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1rem"
            boxShadow="md"
            height="8vh"

        >
          <Box>
            <h1 className="logo">VOICE VOICE</h1>
          </Box>
          <Spacer />
          <Button colorScheme="blue" onClick={handleWalletConnection}>
            {walletAddress ? showWalletAddress : '连接钱包'}
          </Button>
        </Flex>
    <header className="App-header">
      {/*<Button colorScheme="blue" onClick={() => {*/}
      {/*  if (!walletAddress) {*/}
      {/*    console.error('Please connect your wallet first.');*/}
      {/*    return;*/}
      {/*  }*/}

      {/*  const fromAddress = walletAddress;*/}
      {/*  const toAddress = '0x15a0c85082301573B1664586d101CAF2fF86bC8B';*/}
      {/*  const amount = '0.1'; // 0.1 ETH*/}
      {/*  sendTransaction(fromAddress, toAddress, amount);*/}
      {/*}}>*/}
      {/*  Send Transaction*/}
      {/*</Button>*/}
      {/*<Button colorScheme="blue" onClick={async () => {*/}
      {/*  if (!walletAddress) {*/}
      {/*    console.error('Please connect your wallet first.');*/}
      {/*    return;*/}
      {/*  }*/}
      {/*  const retrievedBalance = await getBalance(walletAddress);*/}
      {/*  setBalance(retrievedBalance);*/}
      {/*}}>*/}
      {/*  Check Balance*/}
      {/*</Button>*/}
      {balance !== null && (
          <p>Balance: {balance} ETH</p>
      )}

      <img src="http://1.bp.blogspot.com/-wMgpiDV_QXM/VQfV50JlRlI/AAAAAAAAFZ0/ybPMuUSBLRk/s1600/symbol.gif"
        ref={logoEl}
        className="Alan-logo" alt="logo" />

      <div className="micicon" ref={alanBtnContainer}></div>

      <ua>
        <Text fontSize={50} fontWeight="extrabold" >For Visually Impaired into Web3.0 </Text>
      </ua>
      <Box w="100%" h="25px" />


      <ua>
        <li>Say: "Hello"</li>
        <li>Say: "My name is xxx"</li>
        <li>Say: "Transfer xxx to xxx"</li>
        <li>Say: "Check my balance"</li>
      </ua>
    </header>

  </div>
      </ChakraProvider>)
}

export default App;
