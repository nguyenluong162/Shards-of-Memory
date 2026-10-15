import { useEffect, useState } from 'react';
import { Archive, ChevronRight, DoorOpen, LockKeyhole, MapPin, ShieldAlert, Warehouse } from 'lucide-react';
import { useGameState } from '../context/GameStateContext';
import { playAudio } from '../utils/audio';
import { BackButton, NumericKeypad, PageHeading } from './ui';

export function WarehouseModule() {
  const {
    warehouseBUnlocked,
    puzzles,
    unlockWarehouseB,
    hintsEnabled,
    setActiveModule,
    soundEnabled,
  } = useGameState();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'opening'>('idle');

  const submit = () => {
    if (!code || status !== 'idle') return;
    const normalized = code.replace(/\D/g, '');
    const accepted = [puzzles.phase2WarehouseCode, ...puzzles.phase2AcceptedCodes].map((value) => value.replace(/\D/g, ''));
    if (accepted.includes(normalized)) {
      setStatus('opening');
      if (soundEnabled) playAudio.heavyDoorUnlock();
      window.setTimeout(unlockWarehouseB, 1200);
    } else {
      setStatus('error');
      if (soundEnabled) playAudio.errorBuzz();
      window.setTimeout(() => { setCode(''); setStatus('idle'); }, 700);
    }
  };

  useEffect(() => {
    if (warehouseBUnlocked) return;
    const handler = (event: KeyboardEvent) => {
      if (/^[0-9]$/.test(event.key)) setCode((value) => value.length < 8 ? value + event.key : value);
      if (event.key === 'Backspace') setCode((value) => value.slice(0, -1));
      if (event.key === 'Enter') submit();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  if (warehouseBUnlocked) {
    return (
      <>
        <PageHeading eyebrow="SITE ACCESS / PHASE 02 COMPLETE" title="Warehouse B" detail="Cửa kho đã mở · khu lưu trữ bên trong an toàn để tiếp cận." action={<BackButton onClick={() => setActiveModule('phone')} label="SEIZED PHONE" />} />
        <section className="warehouse-interior">
          <div className="interior-scene">
            <div className="ceiling-light" />
            <div className="warehouse-perspective">
              <div className="shelf left"><i/><i/><i/><i/></div>
              <div className="archive-door"><span>B—19</span><small>RESTRICTED ARCHIVE</small><LockKeyhole/></div>
              <div className="shelf right"><i/><i/><i/><i/></div>
            </div>
            <div className="scene-caption"><span>CAM 02 · WAREHOUSE B · LIVE</span><span>ACCESS ROUTE SECURED</span></div>
          </div>
          <aside className="interior-brief panel">
            <p className="eyebrow">RECOVERED LOCATION</p>
            <h3>Kho lưu trữ nội bộ</h3>
            <p>Lối đi sâu hơn dẫn tới cửa thép B-19. Một terminal bàn cờ và bảng kiểm soát truy cập được lắp bên cạnh cửa.</p>
            <div className="location-facts"><div><MapPin/><span>ZONE</span><strong>SECTOR B / LOWER ARCHIVE</strong></div><div><DoorOpen/><span>STATUS</span><strong>WAREHOUSE UNLOCKED</strong></div></div>
            <button className="solid-action wide" onClick={() => setActiveModule('b19')}>PROCEED TO B-19 <ChevronRight size={16}/></button>
          </aside>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeading eyebrow="PHYSICAL ACCESS / SECURITY NODE WB-02" title="Warehouse B" detail="Cửa kho công nghiệp · keypad điện tử ngoại tuyến." action={<BackButton onClick={() => setActiveModule('phone')} label="SEIZED PHONE" />} />
      <section className="warehouse-entrance">
        <div className={`warehouse-door ${status === 'opening' ? 'opening' : ''}`}>
          <div className="door-warning"><ShieldAlert/><span>AUTHORIZED ACCESS ONLY</span></div>
          <div className="door-panels"><span/><span/><span/><span/><span/></div>
          <div className="door-label"><small>STORAGE SECTOR</small><strong>B</strong></div>
          <div className="door-seam"/>
          <div className="camera-code">CAM 06 · 00:18:42:11</div>
        </div>
        <aside className={`access-terminal ${status === 'error' ? 'denied shake' : ''} ${status === 'opening' ? 'granted' : ''}`}>
          <div className="terminal-head"><Warehouse/><div><small>INDUSTRIAL ACCESS NODE</small><strong>WH-B / ENTRY 02</strong></div><span /></div>
          <div className="terminal-display">
            <small>{status === 'error' ? 'ACCESS DENIED' : status === 'opening' ? 'ACCESS GRANTED' : 'SECURITY LOCK ENGAGED'}</small>
            <div>{Array.from({ length: Math.max(6, code.length) }, (_, index) => <span key={index}>{code[index] ? '●' : '—'}</span>)}</div>
            <p>{status === 'error' ? 'INVALID ACCESS SEQUENCE' : status === 'opening' ? 'DISENGAGING MAGNETIC BOLTS' : 'ENTER AUTHORIZATION SEQUENCE'}</p>
          </div>
          <NumericKeypad value={code} onChange={setCode} length={8} onSubmit={submit} disabled={status !== 'idle'} />
          <div className="terminal-foot"><span>ENTER TO CONFIRM</span><span>NO ATTEMPT LIMIT</span></div>
          {hintsEnabled && <div className="gm-hint"><small>GM HINT ENABLED</small><p>{puzzles.phase2Hint}</p></div>}
        </aside>
      </section>
    </>
  );
}
