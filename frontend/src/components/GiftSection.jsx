import { useState } from "react";

function BankCard({ account }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(account.account_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      /* clipboard not available */
    }
  };

  return (
    <div className="gift-card">
      <div className="gift-bank">{account.bank_name}</div>
      <div className="gift-number">{account.account_number}</div>
      <div className="gift-holder">a.n. {account.account_holder}</div>
      <button className="gift-copy" onClick={copy}>
        {copied ? "Tersalin ✓" : "Salin Nomor"}
      </button>
    </div>
  );
}

export default function GiftSection({ accounts, address }) {
  const hasAccounts = accounts && accounts.length > 0;
  if (!hasAccounts && !address) return null;
  return (
    <>
      {hasAccounts && (
        <div className="gift-list">
          {accounts.map((acc) => (
            <BankCard account={acc} key={acc.id} />
          ))}
        </div>
      )}
      {address && (
        <div className="gift-address">
          <span className="gift-address-label">📦 Kirim Hadiah ke:</span>
          <p>{address}</p>
        </div>
      )}
    </>
  );
}
