import React, { useEffect, useState } from 'react';
import QRCodeLib from 'qrcode';
import './QRCode.css';

interface QRCodeProps {
  value: string;
  size?: number;
  label?: string;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 128, label }) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    QRCodeLib.toDataURL(value || window.location.origin, { margin: 1, width: size })
      .then((url: string) => {
        if (mounted) setDataUrl(url);
      })
      .catch(() => {
        if (mounted) setDataUrl('');
      });
    return () => {
      mounted = false;
    };
  }, [value, size]);

  return (
    <div className="qr-code-wrapper">
      {dataUrl ? (
        <img src={dataUrl} alt={label ? `QR code for ${label}` : 'QR code'} width={size} height={size} />
      ) : (
        <div className="qr-placeholder" style={{ width: size, height: size }} />
      )}
      {label && <div className="qr-label">{label}</div>}
    </div>
  );
};

export default QRCode;
