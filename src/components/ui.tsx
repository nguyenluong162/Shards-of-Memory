import { AlertTriangle, ChevronLeft, LockKeyhole, UserRound, X } from 'lucide-react';
import { playAudio } from '../utils/audio';
import { useGameState } from '../context/GameStateContext';

export function PageHeading({
  eyebrow,
  title,
  detail,
  action,
}: {
  eyebrow: string;
  title: string;
  detail: string;
  action?: React.ReactNode;
}) {
  return (
    <section className="workspace-heading page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{detail}</p>
      </div>
      {action}
    </section>
  );
}

export function BackButton({ onClick, label = 'BACK' }: { onClick: () => void; label?: string }) {
  return <button className="ghost-action" onClick={onClick}><ChevronLeft size={15} /> {label}</button>;
}

export function NumericKeypad({
  value,
  onChange,
  length,
  onSubmit,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  length: number;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  const { soundEnabled } = useGameState();
  const key = (digit: string) => {
    if (disabled || value.length >= length) return;
    if (soundEnabled) playAudio.keypadBeep(620 + Number(digit) * 24);
    onChange(value + digit);
  };

  return (
    <div className="numeric-keypad">
      {[1,2,3,4,5,6,7,8,9].map((digit) => (
        <button key={digit} disabled={disabled} onClick={() => key(String(digit))}>{digit}</button>
      ))}
      <button className="key-command" disabled={disabled} onClick={() => onChange('')}>CLR</button>
      <button disabled={disabled} onClick={() => key('0')}>0</button>
      <button className="key-command enter" disabled={disabled} onClick={onSubmit}>ENT</button>
    </div>
  );
}

export function Avatar({
  src,
  name,
  className = '',
}: {
  src: string;
  name: string;
  className?: string;
}) {
  return (
    <div className={`avatar-frame ${className}`}>
      <UserRound className="avatar-fallback" />
      <img src={src} alt={name} onError={(event) => { event.currentTarget.style.display = 'none'; }} />
      <span>{name.split(' ').slice(-1)[0]?.slice(0, 1) ?? '?'}</span>
    </div>
  );
}

export function LockedModule({
  title,
  detail,
  requirement,
  onBack,
}: {
  title: string;
  detail: string;
  requirement: string;
  onBack: () => void;
}) {
  return (
    <section className="locked-module">
      <div className="locked-symbol"><LockKeyhole size={42} strokeWidth={1.2} /></div>
      <p className="eyebrow">ACCESS CONTROL / MODULE RESTRICTED</p>
      <h2>{title}</h2>
      <p>{detail}</p>
      <div className="requirement-box"><AlertTriangle size={16} /><span>REQUIREMENT</span><strong>{requirement}</strong></div>
      <BackButton onClick={onBack} label="RETURN TO SEIZED PHONE" />
    </section>
  );
}

export function ToastStack() {
  const { toasts, dismissToast } = useGameState();
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <article key={toast.id} className={`toast ${toast.tone}`}>
          <span />
          <div><strong>{toast.title}</strong><p>{toast.detail}</p></div>
          <button aria-label="Đóng thông báo" onClick={() => dismissToast(toast.id)}><X size={14} /></button>
        </article>
      ))}
    </div>
  );
}
