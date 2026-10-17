import { useEffect, useRef, useState } from 'react';
import {
  Archive,
  Download,
  KeyRound,
  Lock,
  LogOut,
  RotateCcw,
  Save,
  Settings2,
  ShieldCheck,
  Smartphone,
  Upload,
  Users,
  Warehouse,
  X,
} from 'lucide-react';
import playersData from '../data/players.json';
import rolesData from '../data/roles.json';
import gameConfig from '../data/game-config.json';
import { useGameState } from '../context/GameStateContext';
import type { Assignment, Player, Role } from '../types';
import { Avatar } from './ui';

const players = playersData as Player[];
const roles = rolesData as Role[];
const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

type AdminTab = 'progress' | 'puzzles' | 'personnel' | 'data';

export function AdminPanel() {
  const game = useGameState();
  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [tab, setTab] = useState<AdminTab>('progress');
  const [draftAssignments, setDraftAssignments] = useState<Assignment[]>(game.assignments);
  const [p1, setP1] = useState(game.puzzles.phase1PhonePin);
  const [p2, setP2] = useState(game.puzzles.phase2WarehouseCode);
  const [p3, setP3] = useState(game.puzzles.phase3B19Code);
  const [dataMessage, setDataMessage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => setDraftAssignments(game.assignments), [game.assignments]);

  if (!game.isAdminOpen) return null;

  const close = () => game.setIsAdminOpen(false);
  const authenticate = (event: React.FormEvent) => {
    event.preventDefault();
    if (passcode === gameConfig.adminPasscode) {
      setAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const assign = (playerId: string, roleId: string) => {
    setDraftAssignments((items) => {
      const withoutPlayer = items.filter((item) => item.playerId !== playerId);
      return roleId ? [...withoutPlayer, { playerId, roleId }] : withoutPlayer;
    });
  };

  const savePuzzles = () => {
    const phonePin = p1.trim();
    const warehouseCode = p2.trim();
    const b19Code = p3.trim();
    if (!/^\d{4}$/.test(phonePin) || !/^\d{4,8}$/.test(warehouseCode) || !/^\d{4}$/.test(b19Code)) {
      setDataMessage('Mã Phone/B-19 phải có 4 số; mã Warehouse cần từ 4–8 số.');
      return;
    }
    game.updatePuzzlesConfig({
      phase1PhonePin: phonePin,
      phase2WarehouseCode: warehouseCode,
      phase2AcceptedCodes: [warehouseCode],
      phase3B19Code: b19Code,
    });
    setDataMessage('Đã lưu puzzle config vào phiên chơi hiện tại.');
  };

  const exportAssignments = () => {
    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), assignments: game.assignments }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'case-2010-personnel-assignments.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importAssignments = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as { assignments?: Assignment[] } | Assignment[];
      const imported = Array.isArray(parsed) ? parsed : parsed.assignments;
      if (!Array.isArray(imported)) throw new Error('Không tìm thấy danh sách assignments.');
      const playerIds = new Set(players.map((player) => player.id));
      const roleIds = new Set(roles.map((role) => role.id));
      const seenPlayers = new Set<string>();
      const seenRoles = new Set<string>();
      imported.forEach((item) => {
        if (!playerIds.has(item.playerId) || !roleIds.has(item.roleId)) throw new Error(`ID không hợp lệ: ${item.playerId} / ${item.roleId}`);
        if (seenPlayers.has(item.playerId) || seenRoles.has(item.roleId)) throw new Error('File có player hoặc role bị gán trùng.');
        seenPlayers.add(item.playerId); seenRoles.add(item.roleId);
      });
      game.setAssignments(imported);
      setDataMessage(`Import thành công ${imported.length} assignments.`);
    } catch (error) {
      setDataMessage(error instanceof Error ? error.message : 'Không thể đọc file JSON.');
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const controlRows = [
    {
      label: 'Seized Phone',
      icon: Smartphone,
      unlocked: game.phoneUnlocked,
      unlock: game.unlockPhone,
      lock: game.lockPhone,
    },
    {
      label: 'Warehouse B',
      icon: Warehouse,
      unlocked: game.warehouseBUnlocked,
      unlock: game.unlockWarehouseB,
      lock: game.lockWarehouseB,
    },
    {
      label: 'Archive B-19',
      icon: Archive,
      unlocked: game.b19Unlocked,
      unlock: game.unlockB19,
      lock: game.lockB19,
    },
  ];

  return (
    <div className="modal-backdrop admin-backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <section className="admin-panel">
        <header><div><Settings2/><span><small>ORGANIZER ACCESS</small><strong>GM CONTROL CENTER</strong></span></div><button onClick={close}><X/></button></header>
        {!authenticated ? (
          <form className="admin-login" onSubmit={authenticate}>
            <div><KeyRound/></div><p className="eyebrow">PROTECTED OPERATOR MODE</p><h2>Organizer authentication</h2><p>Nhập mã BTC để truy cập công cụ can thiệp game và phân vai.</p>
            <label><span>GM PASSCODE</span><input type="password" autoFocus value={passcode} onChange={(event) => setPasscode(event.target.value)} /></label>
            {authError && <small className="form-error">Mã BTC không chính xác.</small>}
            <button className="solid-action" type="submit">AUTHENTICATE</button>
          </form>
        ) : (
          <div className="admin-body">
            <nav>
              <button className={tab === 'progress' ? 'active' : ''} onClick={() => setTab('progress')}><ShieldCheck/>Progress</button>
              <button className={tab === 'puzzles' ? 'active' : ''} onClick={() => setTab('puzzles')}><KeyRound/>Puzzle config</button>
              <button className={tab === 'personnel' ? 'active' : ''} onClick={() => setTab('personnel')}><Users/>Personnel</button>
              <button className={tab === 'data' ? 'active' : ''} onClick={() => setTab('data')}><Save/>Data tools</button>
            </nav>
            <main>
              {tab === 'progress' && (
                <div className="admin-section">
                  <div className="admin-section-title"><p><small>GAME STATE</small><strong>Manual progression control</strong></p><span>PHASE {game.currentPhase}</span></div>
                  <div className="state-cards"><article><span>KNOWN FACTS</span><strong>{game.knownFacts.length}</strong></article><article><span>EVIDENCE</span><strong>{game.evidenceList.filter((item) => item.isUnlocked).length}/{game.evidenceList.length}</strong></article></div>
                  <div className="override-list">{controlRows.map(({ label, icon: Icon, unlocked, unlock, lock }) => <div key={label}><Icon/><span><strong>{label}</strong><small>{unlocked ? 'UNLOCKED' : 'LOCKED'}</small></span><button className={unlocked ? 'danger' : ''} onClick={unlocked ? lock : unlock}>{unlocked ? <Lock/> : <ShieldCheck/>}{unlocked ? 'LOCK' : 'UNLOCK'}</button></div>)}</div>
                  <label className="toggle-row"><span><strong>GM HINTS</strong><small>Chỉ áp dụng Phase 1–2; không tạo hint cho B-19.</small></span><input type="checkbox" checked={game.hintsEnabled} onChange={(event) => game.setHintsEnabled(event.target.checked)}/></label>
                  <label className="toggle-row"><span><strong>SOUND EFFECTS</strong><small>Keypad, deny và unlock feedback.</small></span><input type="checkbox" checked={game.soundEnabled} onChange={(event) => game.setSoundEnabled(event.target.checked)}/></label>
                  <div className="phase-buttons"><span>SET CURRENT PHASE</span>{[1,2,3,4].map((phase) => <button key={phase} className={game.currentPhase === phase ? 'active' : ''} onClick={() => game.setPhase(phase)}>{phase}</button>)}</div>
                </div>
              )}

              {tab === 'puzzles' && (
                <div className="admin-section">
                  <div className="admin-section-title"><p><small>LIVE CONFIG</small><strong>Puzzle access codes</strong></p></div>
                  <p className="admin-help">Các thay đổi chỉ lưu trong trình duyệt hiện tại. Để thay đổi mặc định khi deploy, cập nhật <code>src/data/puzzles.json</code>.</p>
                  <div className="puzzle-fields"><label>PHASE 01 · PHONE PIN<input inputMode="numeric" value={p1} onChange={(event) => setP1(event.target.value.replace(/\D/g, ''))} maxLength={4}/></label><label>PHASE 02 · WAREHOUSE CODE<input inputMode="numeric" value={p2} onChange={(event) => setP2(event.target.value.replace(/\D/g, ''))} maxLength={8}/></label><label>PHASE 03 · B-19 CODE<input inputMode="numeric" value={p3} onChange={(event) => setP3(event.target.value.replace(/\D/g, ''))} maxLength={4}/></label></div>
                  <button className="solid-action" onClick={savePuzzles}><Save/>SAVE PUZZLE CONFIG</button>
                  {dataMessage && <p className="admin-message">{dataMessage}</p>}
                </div>
              )}

              {tab === 'personnel' && (
                <div className="admin-section personnel-admin">
                  <div className="admin-section-title"><p><small>PERSONNEL ASSIGNMENT</small><strong>Player → A2 role mapping</strong></p><span>{draftAssignments.length}/15 ASSIGNED</span></div>
                  <p className="admin-help">Mỗi người và mỗi role chỉ được sử dụng một lần. Role đã chọn sẽ bị khóa ở các hồ sơ khác.</p>
                  <div className="assignment-summary"><span><strong>{15 - draftAssignments.length}</strong> người chưa gán</span><span><strong>{15 - new Set(draftAssignments.map((item) => item.roleId)).size}</strong> role còn trống</span></div>
                  <div className="assignment-list">{players.map((player, index) => {
                    const current = draftAssignments.find((item) => item.playerId === player.id)?.roleId ?? '';
                    const used = new Set(draftAssignments.filter((item) => item.playerId !== player.id).map((item) => item.roleId));
                    return <label key={player.id}><span><b>{String(index + 1).padStart(2, '0')}</b><Avatar src={assetUrl(player.avatarPath)} name={player.displayName}/><strong>{player.displayName}</strong></span><select value={current} onChange={(event) => assign(player.id, event.target.value)}><option value="">— Chưa phân vai —</option>{roles.map((role) => <option key={role.id} value={role.id} disabled={used.has(role.id)}>{role.title}{used.has(role.id) ? ' · đã gán' : ''}</option>)}</select></label>;
                  })}</div>
                  <div className="admin-actions"><button className="ghost-action danger" onClick={() => window.confirm('Xóa toàn bộ phân vai?') && setDraftAssignments([])}><RotateCcw/>CLEAR DRAFT</button><button className="solid-action" onClick={() => game.setAssignments(draftAssignments)}><Save/>SAVE ASSIGNMENTS</button></div>
                </div>
              )}

              {tab === 'data' && (
                <div className="admin-section">
                  <div className="admin-section-title"><p><small>BACKUP & RESET</small><strong>Local session data tools</strong></p></div>
                  <div className="data-actions"><button onClick={exportAssignments}><Download/><span><strong>Export assignments</strong><small>Tải file JSON phân vai về máy.</small></span></button><button onClick={() => fileRef.current?.click()}><Upload/><span><strong>Import assignments</strong><small>Kiểm tra ID và role trùng trước khi lưu.</small></span></button><input ref={fileRef} hidden type="file" accept=".json,application/json" onChange={(event) => importAssignments(event.target.files?.[0])}/></div>
                  {dataMessage && <p className="admin-message">{dataMessage}</p>}
                  <div className="session-zone">
                    <small>SESSION CONTROL</small>
                    <div><span><strong>Quay về opening</strong><p>Trở lại poster mở đầu và giữ nguyên toàn bộ tiến trình.</p></span><button onClick={game.returnToOpening}><LogOut/>BACK TO OPENING</button></div>
                    <div className="reset-row"><span><strong>Reset toàn bộ game</strong><p>Xóa toàn bộ tiến trình rồi quay thẳng về opening. Phân vai được giữ riêng.</p></span><button onClick={() => window.confirm('Xóa toàn bộ tiến trình và quay về opening?') && game.resetGame()}><RotateCcw/>RESET GAME</button></div>
                  </div>
                  <div className="danger-zone"><small>PHASE RESET</small><div><span><strong>Reset riêng Phase 3</strong><p>Khóa B-19 và gỡ TL-02, không ảnh hưởng Phase 1–2.</p></span><button onClick={() => window.confirm('Reset riêng Phase 3?') && game.resetPhase3()}>RESET PHASE 3</button></div></div>
                </div>
              )}
            </main>
          </div>
        )}
      </section>
    </div>
  );
}
