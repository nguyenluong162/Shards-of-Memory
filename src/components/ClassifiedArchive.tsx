import { useEffect, useState } from 'react';
import {
  Clapperboard,
  Clock3,
  FileLock2,
  FileText,
  FolderLock,
  LockKeyhole,
  Mail,
  ScrollText,
  Truck,
  UsersRound,
  X,
} from 'lucide-react';
import classifiedData from '../data/classified.json';
import rolesData from '../data/roles.json';
import { useGameState } from '../context/GameStateContext';
import type { Role } from '../types';

const roles = rolesData as Role[];
const videoUrl = `${import.meta.env.BASE_URL}secret/1023.mp4`;

const caseFiles = import.meta.glob<string>('../../doc/case-2010-tron-bo/*/*.png', { eager: true, query: '?url', import: 'default' });

const fileTitles: Record<string, string> = {
  '00-boi-canh-cong-khai': 'Bối cảnh công khai',
  'DT-01-xe-ke-toan': 'ĐT-01 — Xe Kế toán',
  'DT-02-xe-ky-thuat-vien-camera': 'ĐT-02 — Xe Kỹ thuật viên camera',
  'DT-03-xe-cuu-ve-si': 'ĐT-03 — Xe Cựu vệ sĩ',
  'DT-04-xe-truong-ban-su-kien': 'ĐT-04 — Xe Trưởng ban sự kiện',
  'DT-05-xe-nguoi-than-nan-nhan': 'ĐT-05 — Xe Người thân nạn nhân',
  'DT-06-xe-van-chuyen-R2': 'ĐT-06 — Xe vận chuyển R2',
  'DT-07-xe-cong-vu-ban-lanh-dao': 'ĐT-07 — Xe công vụ ban lãnh đạo',
  'DC-00-nhat-ky-vao-kho-B': 'Nhật ký vào kho B',
  'DC-01-nhat-ky-quet-the-B19': 'Nhật ký quẹt thẻ B-19',
  'DC-02-nhat-ky-su-dung-xe': 'Nhật ký sử dụng xe',
  'DC-03-so-cap-the-kho-B': 'Sổ cấp thẻ kho B',
  'DC-04-bang-doi-chieu-giao-dich': 'Bảng đối chiếu giao dịch',
  'phong-bi-01-ve-si': 'Phong bì 01 — Cựu vệ sĩ',
  'PB-02-ke-toan': 'Phong bì 02 — Kế toán',
  'PB-03-truong-ban-su-kien': 'Phong bì 03 — Trưởng ban sự kiện',
  'PB-04-ky-thuat-vien-camera': 'Phong bì 04 — Kỹ thuật viên camera',
  'PB-05-nguoi-than-nan-nhan': 'Phong bì 05 — Người thân nạn nhân',
  'PB-06-truong-bo-phan-truyen-thong': 'Phong bì 06 — Trưởng bộ phận truyền thông',
  'SE-01-ho-so-bo-sung-xe-A2-13': 'Hồ sơ bổ sung — Xe A2-13',
};

interface ArchiveFile { title: string; filename: string; url: string; secret?: boolean }

const toFiles = (folder: string, secret = false): ArchiveFile[] =>
  Object.entries(caseFiles)
    .filter(([path]) => path.includes(`/${folder}/`))
    .map(([path, url]) => {
      const filename = path.split('/').pop() ?? path;
      const key = filename.replace(/\.png$/, '');
      const title = fileTitles[key] ?? `${key} — ${roles.find((role) => role.id === key)?.title ?? 'Hồ sơ'}`;
      return { title, filename, url, secret };
    })
    .sort((a, b) => a.filename.localeCompare(b.filename, 'en', { numeric: true }));

type ArchiveTab = 'video' | 'case' | 'timeline' | 'characters' | 'reports' | 'props' | 'envelopes';

const fileTabs: Partial<Record<ArchiveTab, ArchiveFile[]>> = {
  characters: toFiles('0-ho-so-nhan-vat'),
  reports: [...toFiles('2-bien-ban-dieu-tra'), ...toFiles('5-phase-cuoi-secret-ending', true)],
  props: [...toFiles('1-boi-canh'), ...toFiles('3-dao-cu')],
  envelopes: toFiles('4-phong-bi'),
};

const tabs = [
  { id: 'video' as const, label: 'Tệp 1023', detail: 'VIDEO', icon: Clapperboard },
  { id: 'case' as const, label: 'Hồ sơ vụ án', detail: 'KẾT LUẬN', icon: ScrollText },
  { id: 'timeline' as const, label: 'Sự thật đêm 19/10', detail: 'DÒNG THỜI GIAN', icon: Clock3 },
  { id: 'characters' as const, label: 'Hồ sơ nhân vật', detail: '15 HỒ SƠ', icon: UsersRound },
  { id: 'reports' as const, label: 'Biên bản điều tra', detail: 'PHƯƠNG TIỆN', icon: Truck },
  { id: 'props' as const, label: 'Đạo cụ & bối cảnh', detail: 'VẬT CHỨNG', icon: FileText },
  { id: 'envelopes' as const, label: 'Phong bì mật', detail: '6 PHONG BÌ', icon: Mail },
];

function Redacted() {
  return <span className="redacted"><LockKeyhole size={11} /> DỮ LIỆU NIÊM PHONG — CẦN SECRET ENDING</span>;
}

export function ClassifiedArchive({ onClose }: { onClose: () => void }) {
  const { secretEndingUnlocked } = useGameState();
  const [tab, setTab] = useState<ArchiveTab>('video');
  const [selectedFile, setSelectedFile] = useState<ArchiveFile | null>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (selectedFile) setSelectedFile(null);
      else onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose, selectedFile]);

  const files = fileTabs[tab];
  const activeTab = tabs.find((item) => item.id === tab)!;

  return (
    <div className="classified-archive" role="dialog" aria-modal="true" aria-label="Tài liệu mật">
      <header className="classified-head">
        <div className="classified-stamp"><FolderLock size={18} /><span>TOP SECRET</span></div>
        <div>
          <p className="eyebrow">CASE 20:10 / DECLASSIFIED ARCHIVE</p>
          <h2>Tài liệu mật</h2>
        </div>
        <button className="ghost-action" onClick={onClose}><X size={14} /> ĐÓNG</button>
      </header>

      <div className="classified-body">
        <nav className="classified-tabs" aria-label="Danh mục tài liệu mật">
          {tabs.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}>
                <Icon size={16} strokeWidth={1.6} />
                <span>{item.label}<small>{item.detail}</small></span>
              </button>
            );
          })}
        </nav>

        <section className="classified-content" key={tab}>
          <p className="eyebrow">{activeTab.detail}</p>
          <h3>{activeTab.label}</h3>

          {tab === 'video' && (
            <div className="classified-video">
              <video src={videoUrl} controls preload="metadata" playsInline />
              <p><FileLock2 size={13} /> 1023 — tệp ghi hình thu hồi từ kho lưu trữ vụ án.</p>
            </div>
          )}

          {tab === 'case' && (
            <div className="classified-case">
              <article className="classified-brief">
                {classifiedData.briefing.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </article>
              <dl className="classified-solution">
                {classifiedData.solution.map((item) => (
                  <div key={item.label} className={item.secret ? 'secret' : ''}>
                    <dt>{item.label}</dt>
                    <dd>{item.secret && !secretEndingUnlocked ? <Redacted /> : item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {tab === 'timeline' && (
            <ol className="classified-timeline">
              {classifiedData.timeline.map((entry, index) => (
                <li key={index} className={entry.secret ? 'secret' : ''}>
                  <time>{entry.time}</time>
                  <p>{entry.secret && !secretEndingUnlocked ? <Redacted /> : entry.text}</p>
                </li>
              ))}
            </ol>
          )}

          {files && (
            <div className="classified-files">
              {files.map((file) => {
                const locked = file.secret && !secretEndingUnlocked;
                return (
                  <button key={file.filename} className={`case-document-card ${locked ? 'locked' : ''}`} disabled={locked} onClick={() => setSelectedFile(file)}>
                    <span className="case-document-preview">
                      {locked ? <LockKeyhole size={34} strokeWidth={1.2} /> : <img src={file.url} alt={file.title} loading="lazy" />}
                    </span>
                    <span className="case-document-meta"><FileText size={15} /><strong>{locked ? 'Hồ sơ niêm phong' : file.title}</strong><small>{locked ? 'MỞ KHI ĐẠT SECRET ENDING' : file.filename}</small></span>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {selectedFile && (
        <div className="modal-backdrop document-viewer" onMouseDown={(event) => event.target === event.currentTarget && setSelectedFile(null)}>
          <div className="case-document-viewer"><img src={selectedFile.url} alt={selectedFile.title} /></div>
          <div className="document-controls">
            <span>{selectedFile.title}</span>
            <button onClick={() => setSelectedFile(null)}><X /> CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
}
