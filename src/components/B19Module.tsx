import { useEffect, useMemo, useRef, useState } from 'react';
import { Archive, Check, DoorOpen, FileSearch, LockKeyhole, RotateCcw, Server, X } from 'lucide-react';
import boardData from '../data/b19-board.json';
import accessLogData from '../data/b19-access-log.json';
import { useGameState } from '../context/GameStateContext';
import { playAudio } from '../utils/audio';
import { BackButton, NumericKeypad, PageHeading } from './ui';

const files = ['a','b','c','d','e','f','g','h'];
const ranks = [8,7,6,5,4,3,2,1];
const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
const pieceGlyph: Record<string, string> = {
  'white-king': '♔', 'white-queen': '♕', 'white-rook': '♖', 'white-bishop': '♗', 'white-knight': '♘', 'white-pawn': '♙',
  'black-king': '♚', 'black-queen': '♛', 'black-rook': '♜', 'black-bishop': '♝', 'black-knight': '♞', 'black-pawn': '♟',
};
function ChessTerminal() {
  const [selected, setSelected] = useState<string[]>([]);
  const pieces = boardData.pieces as Array<{ square: string; piece: string }>;
  const pieceMap = useMemo(() => new Map(pieces.map((piece) => [piece.square, piece.piece])), [pieces]);

  const toggle = (square: string) => setSelected((items) => items.includes(square) ? items.filter((item) => item !== square) : [...items, square]);

  return (
    <section className="chess-terminal panel">
      <div className="terminal-head"><Server/><div><small>STATIC POSITION ANALYSIS</small><strong>CHESS TERMINAL / B19-CT</strong></div><span className={boardData.sourceReady ? 'online' : ''}/></div>
      <div className="chess-screen">
        {!boardData.sourceReady && <div className="board-source-warning"><span>POSITION DATA PENDING</span><p>Terminal đã sẵn sàng. BTC cần nạp thế cờ gốc vào cấu hình trước khi chơi.</p></div>}
        {boardData.sourceReady && boardData.imagePath && <div className="chess-reference"><img src={assetUrl(boardData.imagePath)} alt="Thế cờ gốc do BTC cung cấp" /></div>}
        <div className="chess-board" role="grid" aria-label="Bàn cờ phân tích">
          {ranks.flatMap((rank) => files.map((file, fileIndex) => {
            const square = `${file}${rank}`;
            const piece = pieceMap.get(square);
            return (
              <button
                role="gridcell"
                aria-label={`Ô ${square}`}
                aria-pressed={selected.includes(square)}
                className={`${(rank + fileIndex) % 2 === 0 ? 'light' : 'dark'} ${selected.includes(square) ? 'selected' : ''}`}
                key={square}
                onClick={() => toggle(square)}
              >
                {file === 'a' && <i className="rank-label">{rank}</i>}
                {rank === 1 && <i className="file-label">{file}</i>}
                {piece && <b className={piece.startsWith('white-') ? 'white-piece' : 'black-piece'}>{pieceGlyph[piece] ?? '?'}</b>}
                {selected.includes(square) && <span><Check/></span>}
              </button>
            );
          }))}
        </div>
      </div>
      <div className="selection-tray"><div><small>MARKED SQUARES</small><strong>{selected.length ? selected.join(' · ').toUpperCase() : 'NONE'}</strong></div><button onClick={() => setSelected([])}><RotateCcw/> CLEAR SELECTION</button></div>
    </section>
  );
}

function AccessLogModal({ onClose }: { onClose: () => void }) {
  const [scale, setScale] = useState(1);
  return (
    <div className="modal-backdrop document-viewer" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="evidence-document" style={{ transform: `scale(${scale})` }}>
        <div className="document-stamp">TL—02</div>
        <header><small>RESTRICTED ARCHIVE // SECTOR B-19</small><h2>NHẬT KÝ TRUY CẬP B-19</h2><p>CONTROL TERMINAL EXPORT · CHECKSUM VERIFIED</p></header>
        <div className="log-table"><div><strong>TIME</strong><strong>CARD ID</strong><strong>REGISTERED ROLE</strong></div>{accessLogData.map((row) => <div key={row.time}><span>{row.time}</span><span>{row.cardId}</span><span>{row.registeredRole}</span></div>)}</div>
        <footer><span>CASE 20:10 / EVIDENCE TL-02</span><span>END OF RECORD</span></footer>
      </div>
      <div className="document-controls"><button onClick={() => setScale((value) => Math.max(.7, value - .1))}>−</button><span>{Math.round(scale * 100)}%</span><button onClick={() => setScale((value) => Math.min(1.4, value + .1))}>+</button><button onClick={onClose}><X/> CLOSE</button></div>
    </div>
  );
}

function ArchiveRoom() {
  const [showLog, setShowLog] = useState(false);
  const { setActiveModule } = useGameState();
  return (
    <>
      <PageHeading eyebrow="RESTRICTED ARCHIVE / PHASE 03 COMPLETE" title="Inside B-19" detail="Phòng hồ sơ kín · evidence recovery in progress." action={<BackButton onClick={() => setActiveModule('warehouse')} label="WAREHOUSE B" />} />
      <section className="archive-room">
        <div className="archive-scene">
          <div className="archive-light"/>
          <div className="cabinet bank-a"><span>A</span>{[1,2,3,4,5,6].map((item) => <i key={item}/>)}</div>
          <div className="archive-desk"><div className="archive-monitor"><small>RECORD FOUND</small><strong>TL—02</strong></div><div className="desk-box">B19<br/>LOGS</div></div>
          <div className="cabinet bank-b"><span>B</span>{[1,2,3,4,5,6].map((item) => <i key={item}/>)}</div>
          <button className="evidence-hotspot" onClick={() => setShowLog(true)}><FileSearch/><span>OPEN RECOVERED RECORD</span><strong>TL-02</strong></button>
        </div>
        <aside className="archive-summary panel"><p className="eyebrow">NEW EVIDENCE</p><h3>TL-02 — Nhật ký truy cập B-19</h3><p>Bản ghi chứa năm lượt truy cập theo thời gian và mã thẻ. Dữ liệu không xác nhận người thực sự đã sử dụng thẻ.</p><button className="solid-action wide" onClick={() => setShowLog(true)}>VIEW FULL RECORD</button><div className="chain-note"><small>CHAIN OF CUSTODY</small><strong>RECOVERED · INDEXED · VERIFIED</strong></div></aside>
      </section>
      {showLog && <AccessLogModal onClose={() => setShowLog(false)} />}
    </>
  );
}

export function B19Module() {
  const { b19Unlocked, puzzles, unlockB19, soundEnabled, setActiveModule } = useGameState();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'opening'>('idle');
  const [timer, setTimer] = useState<number | null>(null);
  const booted = useRef(false);

  useEffect(() => {
    if (!soundEnabled) {
      playAudio.stopAmbient();
      return;
    }
    if (!booted.current) {
      playAudio.terminalBoot();
      booted.current = true;
    }
    playAudio.startAmbient();
    return () => playAudio.stopAmbient();
  }, [soundEnabled]);

  useEffect(() => () => {
    if (timer) window.clearTimeout(timer);
  }, [timer]);

  const complete = () => {
    if (timer) window.clearTimeout(timer);
    unlockB19();
  };

  const submit = () => {
    if (code.length !== 4 || status !== 'idle') return;
    if (code === puzzles.phase3B19Code) {
      setStatus('opening');
      if (soundEnabled) playAudio.heavyDoorUnlock();
      const id = window.setTimeout(complete, 1900);
      setTimer(id);
    } else {
      setStatus('error');
      if (soundEnabled) playAudio.errorBuzz();
      window.setTimeout(() => { setCode(''); setStatus('idle'); }, 650);
    }
  };

  useEffect(() => {
    if (b19Unlocked) return;
    const handler = (event: KeyboardEvent) => {
      if (/^[0-9]$/.test(event.key)) setCode((value) => value.length < 4 ? value + event.key : value);
      if (event.key === 'Backspace') setCode((value) => value.slice(0, -1));
      if (event.key === 'Enter') submit();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  if (b19Unlocked) return <ArchiveRoom />;

  return (
    <>
      <PageHeading eyebrow="PHASE 03 / THE SEALED ROOM" title="B-19 Security Access" detail="Restricted archive corridor · static puzzle terminal online." action={<BackButton onClick={() => setActiveModule('warehouse')} label="WAREHOUSE B" />} />
      <section className="b19-layout">
        <ChessTerminal />
        <div className={`b19-door ${status === 'opening' ? 'opening' : ''}`}>
          <div className="b19-sign"><small>RESTRICTED ARCHIVE</small><strong>SECTOR B—19</strong><span>AUTHORIZED PERSONNEL ONLY</span></div>
          <div className="b19-wheel"><span/><i/><b/></div>
          <div className="b19-lock-state"><span className={status === 'opening' ? 'green' : ''}/><small>{status === 'opening' ? 'LOCK DISENGAGED' : 'SECURITY LOCK ENGAGED'}</small></div>
          {status === 'opening' && <button className="skip-animation" onClick={complete}>SKIP ANIMATION</button>}
        </div>
        <section className={`b19-panel panel ${status === 'error' ? 'denied shake' : ''} ${status === 'opening' ? 'granted' : ''}`}>
          <div className="terminal-head"><LockKeyhole/><div><small>ACCESS CONTROL</small><strong>B19-AC / REV.04</strong></div><span /></div>
          <div className="b19-display"><small>{status === 'error' ? 'ACCESS DENIED' : status === 'opening' ? 'ACCESS GRANTED' : 'LOCKED'}</small><div>{Array.from({ length: 4 }, (_, index) => <span key={index}>{code[index] ? code[index] : '—'}</span>)}</div><p>{status === 'error' ? 'CLEARING INPUT BUFFER' : status === 'opening' ? 'OPENING ARCHIVE DOOR' : 'ENTER FOUR-DIGIT CODE'}</p></div>
          <NumericKeypad value={code} onChange={setCode} length={4} onSubmit={submit} disabled={status !== 'idle'} />
          <div className="terminal-foot"><span>PHYSICAL KEYS ENABLED</span><span>NO WEB HINTS</span></div>
        </section>
      </section>
    </>
  );
}
