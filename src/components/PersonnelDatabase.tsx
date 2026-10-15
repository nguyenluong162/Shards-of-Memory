import { useMemo, useState } from 'react';
import { BadgeCheck, Search, ShieldQuestion, X } from 'lucide-react';
import playersData from '../data/players.json';
import rolesData from '../data/roles.json';
import { useGameState } from '../context/GameStateContext';
import type { Player, Role } from '../types';
import { Avatar, BackButton, PageHeading } from './ui';

const players = playersData as Player[];
const roles = rolesData as Role[];
const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

function ProfileModal({ player, role, onClose }: { player: Player; role?: Role; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="profile-modal">
        <button className="profile-close" onClick={onClose}><X/></button>
        <div className="profile-visual"><Avatar src={assetUrl(player.avatarPath)} name={player.displayName} /><div className="profile-scan"/><span>PERSONNEL RECORD</span></div>
        <div className="profile-content">
          <p className="eyebrow">AUTHORIZED PUBLIC PROFILE</p>
          <small>{role?.id ?? 'UNASSIGNED'}</small>
          <h2>{player.displayName}</h2>
          <h3>{role?.title ?? 'Chưa được BTC gán vai trò'}</h3>
          <div className="profile-rule"/>
          <p>{role?.publicDescription ?? 'Hồ sơ này chưa có dữ liệu vai trò công khai. BTC có thể gán vai trong Admin Mode.'}</p>
          <dl><div><dt>PLAYER ID</dt><dd>{player.id.toUpperCase()}</dd></div><div><dt>ACCESS</dt><dd>PUBLIC CASE RECORD</dd></div><div><dt>CLASSIFICATION</dt><dd>GAME PERSONNEL</dd></div></dl>
          <button className="solid-action" onClick={onClose}>CLOSE RECORD</button>
        </div>
      </section>
    </div>
  );
}

export function PersonnelDatabase() {
  const { assignments, setActiveModule } = useGameState();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Player | null>(null);

  const roleForPlayer = (playerId: string) => {
    const assignment = assignments.find((item) => item.playerId === playerId);
    return roles.find((role) => role.id === assignment?.roleId);
  };

  const records = useMemo(() => players.map((player) => ({ player, role: roleForPlayer(player.id) }))
    .filter(({ player, role }) => `${player.displayName} ${role?.id ?? ''} ${role?.title ?? ''}`.toLowerCase().includes(query.toLowerCase())), [assignments, query]);

  return (
    <>
      <PageHeading
        eyebrow="PERSONNEL INDEX / PUBLIC RECORDS"
        title="Personnel Database"
        detail="Danh bạ 15 người chơi và vai trò công khai · available from Phase 01."
        action={<div className="heading-actions"><div className="assignment-count"><BadgeCheck/><span>ASSIGNED</span><strong>{assignments.length}/15</strong></div><BackButton onClick={() => setActiveModule('phone')} label="SEIZED PHONE" /></div>}
      />
      <section className="personnel-tools panel"><label className="inline-search"><Search/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên, mã A2 hoặc chức danh..." /></label><div><span>{records.length} RECORDS SHOWN</span><span>LOCAL DATABASE</span></div></section>
      <section className="personnel-grid">
        {records.map(({ player, role }, index) => (
          <button className="personnel-card" key={player.id} onClick={() => setSelected(player)}>
            <span className="card-index">{String(index + 1).padStart(2, '0')}</span>
            <Avatar src={assetUrl(player.avatarPath)} name={player.displayName} />
            <div className="personnel-data"><small>{role?.id ?? 'ROLE PENDING'}</small><h3>{player.displayName}</h3><p>{role?.title ?? 'Chưa phân vai'}</p></div>
            <span className={`record-status ${role ? 'assigned' : ''}`}>{role ? <BadgeCheck/> : <ShieldQuestion/>}</span>
          </button>
        ))}
      </section>
      {!records.length && <div className="empty-state personnel-empty"><Search/><strong>Không có hồ sơ phù hợp</strong><p>Thử tìm bằng tên, mã A2 hoặc chức danh khác.</p></div>}
      {selected && <ProfileModal player={selected} role={roleForPlayer(selected.id)} onClose={() => setSelected(null)} />}
    </>
  );
}
