import { useEffect, useState } from 'react';
import { ChevronRight, DoorOpen, FileSearch, Footprints, LockKeyhole, ShieldAlert, Warehouse, X } from 'lucide-react';
import { useGameState } from '../context/GameStateContext';
import { playAudio } from '../utils/audio';
import { BackButton, NumericKeypad, PageHeading } from './ui';

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

function WarehouseDocumentModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop document-viewer warehouse-document-viewer" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="warehouse-document">
        <img src={assetUrl('/evidence/phase2/DanhSachKhoB.png')} alt="Danh sách người vào Kho B" />
      </div>
      <div className="document-controls"><button onClick={onClose}><X /> CLOSE</button></div>
    </div>
  );
}

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
  const [interiorStage, setInteriorStage] = useState<'threshold' | 'walking' | 'arrived'>('threshold');
  const [showWarehouseDocument, setShowWarehouseDocument] = useState(false);

  const submit = () => {
    if (!code || status !== 'idle') return;
    const normalized = code.replace(/\D/g, '');
    const accepted = [puzzles.phase2WarehouseCode, ...puzzles.phase2AcceptedCodes].map((value) => value.replace(/\D/g, ''));
    if (accepted.includes(normalized)) {
      setStatus('opening');
      if (soundEnabled) playAudio.heavyDoorUnlock();
      window.setTimeout(unlockWarehouseB, 1800);
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

  useEffect(() => {
    if (interiorStage !== 'walking') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setInteriorStage('arrived'), reducedMotion ? 80 : 6200);
    return () => window.clearTimeout(timer);
  }, [interiorStage]);

  const enterWarehouse = () => {
    if (interiorStage !== 'threshold') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setInteriorStage('walking');
    if (soundEnabled && !reducedMotion) playAudio.slowFootsteps();
  };

  if (warehouseBUnlocked) {
    const isWalking = interiorStage === 'walking';
    const hasArrived = interiorStage === 'arrived';
    return (
      <>
        <PageHeading eyebrow="SITE ACCESS / PHASE 02 COMPLETE" title="Warehouse B" detail={hasArrived ? 'Đã tiếp cận cửa lưu trữ B-19.' : isWalking ? 'Đang tiến sâu vào hành lang kho lưu trữ…' : 'Cửa kho đã mở · lối vào bên trong đã sẵn sàng.'} action={<BackButton onClick={() => setActiveModule('phone')} label="SEIZED PHONE" />} />
        <section className={`warehouse-interior stage-${interiorStage}`}>
          <div className={`interior-scene ${interiorStage}`}>
            <div className="ceiling-light" />
            <div className={`warehouse-perspective ${interiorStage}`}>
              <div className="shelf left"><i/><i/><i/><i/></div>
              <div className="archive-door"><span>B—19</span><small>RESTRICTED ARCHIVE</small><LockKeyhole/></div>
              <div className="shelf right"><i/><i/><i/><i/></div>
            </div>
            {interiorStage === 'threshold' && <button className="enter-warehouse" onClick={enterWarehouse}><DoorOpen/><span><small>THRESHOLD READY</small><strong>ENTER WAREHOUSE B</strong></span><ChevronRight/></button>}
            {isWalking && <div className="walking-status" aria-live="polite"><Footprints/><span><small>APPROACHING RESTRICTED ARCHIVE</small><strong>CỘP · · · CỘP · · ·</strong></span></div>}
            {!isWalking && <div className="interior-actions">
              <button className="ghost-action" onClick={() => setShowWarehouseDocument(true)}><FileSearch size={15}/> VIEW RECOVERED DOCUMENT</button>
              {hasArrived && <button className="solid-action" onClick={() => setActiveModule('b19')}>PROCEED TO B-19 <ChevronRight size={16}/></button>}
            </div>}
            <div className="scene-caption"><span>CAM 02 · WAREHOUSE B · LIVE</span><span>ACCESS ROUTE SECURED</span></div>
          </div>
        </section>
        {showWarehouseDocument && <WarehouseDocumentModal onClose={() => setShowWarehouseDocument(false)} />}
      </>
    );
  }

  return (
    <>
      <PageHeading eyebrow="PHYSICAL ACCESS / SECURITY NODE WB-02" title="Warehouse B"  action={<BackButton onClick={() => setActiveModule('phone')} label="SEIZED PHONE" />} />
      <section className="warehouse-entrance">
        <div className={`warehouse-door ${status === 'opening' ? 'opening' : ''}`}>
          <div className="warehouse-depth-preview"><span>ACCESS ROUTE OPEN</span><i/></div>
          <div className="warehouse-door-leaf left"><div className="door-panels"><span/><span/><span/><span/><span/></div></div>
          <div className="warehouse-door-leaf right"><div className="door-panels"><span/><span/><span/><span/><span/></div></div>
          <div className="door-warning"><ShieldAlert/><span>AUTHORIZED ACCESS ONLY</span></div>
          <div className="door-label"><small>STORAGE SECTOR</small><strong>B</strong></div>
          <div className="door-seam"/>
          <div className="camera-code">CAM 06 · 00:18:42:11</div>
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
        </div>
      </section>
    </>
  );
}
