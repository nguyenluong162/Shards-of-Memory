import { useEffect, useState } from 'react';
import { ChevronRight, FolderLock, KeyRound, LockKeyhole, X } from 'lucide-react';
import endingsData from '../data/endings.json';
import { useGameState } from '../context/GameStateContext';
import { playAudio } from '../utils/audio';
import { BackButton, PageHeading } from './ui';
import { ClassifiedArchive } from './ClassifiedArchive';

interface Ending {
  id: string;
  code: string;
  kind: 'main' | 'side' | 'bad' | 'secret';
  title: string;
  subtitle: string;
  condition: string;
  verdict: { label: string; value: string }[];
  narrative: string[];
  unlockCodes?: string[];
  unlockPrompt?: string;
}

const endings = endingsData as Ending[];
const posterUrl = `${import.meta.env.BASE_URL}evidence/poster/Poster.png`;

function EndingReveal({ ending, onClose, onOpenArchive }: { ending: Ending; onClose: () => void; onOpenArchive: () => void }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return (
    <div className={`ending-reveal ${ending.kind}`} role="dialog" aria-modal="true" aria-label={ending.title}>
      <img className="ending-reveal-bg" src={posterUrl} alt="" aria-hidden="true" />
      <div className="ending-reveal-inner">
        <p className="ending-reveal-code">{ending.code} · {ending.subtitle}</p>
        <h2>{ending.title}</h2>
        <div className="ending-reveal-story">
          {ending.narrative.map((paragraph, index) => (
            <p key={paragraph} style={{ animationDelay: `${0.9 + index * 1.4}s` }}>{paragraph}</p>
          ))}
        </div>
        <dl className="ending-verdict" style={{ animationDelay: `${0.9 + ending.narrative.length * 1.4}s` }}>
          {ending.verdict.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
        </dl>
        <div className="ending-reveal-actions" style={{ animationDelay: `${1.4 + ending.narrative.length * 1.4}s` }}>
          <button className="solid-action" onClick={onOpenArchive}><FolderLock size={14} /> MỞ TÀI LIỆU MẬT</button>
          <button className="ghost-action" onClick={onClose}><X size={14} /> CHỌN ĐOẠN KẾT KHÁC</button>
        </div>
      </div>
    </div>
  );
}

function SecretUnlock({ ending, onUnlocked }: { ending: Ending; onUnlocked: () => void }) {
  const { soundEnabled } = useGameState();
  const [code, setCode] = useState('');
  const [denied, setDenied] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = code.replace(/\D/g, '');
    if (ending.unlockCodes?.includes(normalized)) {
      if (soundEnabled) playAudio.accessGranted();
      onUnlocked();
    } else {
      if (soundEnabled) playAudio.errorBuzz();
      setDenied(true);
    }
  };

  return (
    <form className={`ending-secret-form ${denied ? 'denied' : ''}`} onSubmit={submit} onClick={(event) => event.stopPropagation()}>
      <label htmlFor="secret-code">{ending.unlockPrompt}</label>
      <div>
        <input id="secret-code" inputMode="numeric" autoComplete="off" value={code} placeholder="09xx xxx xxx" onChange={(event) => { setCode(event.target.value); setDenied(false); }} />
        <button type="submit" aria-label="Xác nhận"><KeyRound size={14} /></button>
      </div>
      {denied && <small>KHÔNG KHỚP DỮ LIỆU — TRUY CẬP BỊ TỪ CHỐI</small>}
    </form>
  );
}

export function EndingModule() {
  const { setActiveModule, secretEndingUnlocked, setSecretEndingUnlocked } = useGameState();
  const [activeEnding, setActiveEnding] = useState<Ending | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);

  const openArchive = () => {
    setActiveEnding(null);
    setArchiveOpen(true);
  };

  return (
    <div className="ending-page">
      <PageHeading
        eyebrow="PHASE 04 / FINAL VERDICT"
        title="Đoạn kết vụ án 20:10"
        detail="Chọn đoạn kết tương ứng với kết luận của tổ điều tra. Đoạn kết bí mật chỉ mở khi tìm ra mắt xích cuối cùng."
        action={(
          <div className="heading-actions">
            <BackButton onClick={() => setActiveModule('case-documents')} label="CASE DOCUMENTS" />
            <button className="solid-action" onClick={() => setArchiveOpen(true)}><FolderLock size={14} /> TÀI LIỆU MẬT</button>
          </div>
        )}
      />

      <section className="ending-grid">
        {endings.map((ending) => {
          const locked = ending.kind === 'secret' && !secretEndingUnlocked;
          return (
            <article key={ending.id} className={`ending-card ${ending.kind} ${locked ? 'locked' : ''}`}>
              <header>
                <span>{ending.code}</span>
                {locked && <LockKeyhole size={14} />}
              </header>
              <h3>{locked ? '██████ ██ ███' : ending.title}</h3>
              <p className="ending-card-subtitle">{locked ? 'Kết thúc bí mật — chưa được giải mã' : ending.subtitle}</p>
              <p className="ending-card-condition"><small>ĐIỀU KIỆN</small>{ending.condition}</p>
              {locked
                ? <SecretUnlock ending={ending} onUnlocked={() => { setSecretEndingUnlocked(true); setActiveEnding(ending); }} />
                : <button className="ending-card-play" onClick={() => setActiveEnding(ending)}>XEM ĐOẠN KẾT <ChevronRight size={14} /></button>}
            </article>
          );
        })}
      </section>

      {activeEnding && <EndingReveal ending={activeEnding} onClose={() => setActiveEnding(null)} onOpenArchive={openArchive} />}
      {archiveOpen && <ClassifiedArchive onClose={() => setArchiveOpen(false)} />}
    </div>
  );
}
