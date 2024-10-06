import { useAccount, useConnect, useSignMessage } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useState } from 'react';

export default function Signer() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const { signMessage } = useSignMessage();
  const [message, setMessage] = useState("Hello, sign this message!");
  const [signature, setSignature] = useState('');

  const handleSignMessage = async () => {
    try {
      const signature = await signMessage({ message });
      setSignature(signature);
    } catch (error) {
      console.error("Error signing message", error);
    }
  };

  return (
    <div>
      {!isConnected ? (
        <button onClick={() => connect()}>Connect Wallet</button>
      ) : (
        <div>
          <p>Wallet connected: {address}</p>
          <p>Message: {message}</p>
          <button onClick={handleSignMessage}>Sign Message</button>
          {signature && <p>Signature: {signature}</p>}
        </div>
      )}
    </div>
  );
}