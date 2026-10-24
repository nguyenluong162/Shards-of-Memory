import { useEffect, useMemo, useState } from 'react';
import {
  BatteryMedium,
  ChevronLeft,
  FileText,
  Image as ImageIcon,
  Lock,
  MessageCircle,
  Phone,
  Play,
  Search,
  Signal,
  Wifi,
  X,
  ZoomIn,
} from 'lucide-react';
import photos from '../data/photos.json';
import phoneNotes from '../data/notes.json';
import { useGameState } from '../context/GameStateContext';
import type { PhonePhoto } from '../types';
import { playAudio } from '../utils/audio';
import { NumericKeypad, PageHeading } from './ui';

type PhoneView = 'home' | 'photos' | 'notes' | 'phone' | 'messages';
const messages = [{ sender: '0901 234 158', preview: '1 tin nhắn đã tự hủy', time: '19:58' }];
const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

function PhotoViewer({ photo, onClose }: { photo: PhonePhoto; onClose: () => void }) {
  const [zoom, setZoom] = useState(1);
  return (
    <div className="modal-backdrop photo-viewer" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <button className="viewer-close" onClick={onClose}><X /> CLOSE</button>
      <div className="photo-stage">
        {photo.mediaType === 'video'
          ? <video src={assetUrl(photo.url)} controls autoPlay playsInline />
          : <img src={assetUrl(photo.url)} alt={photo.notes || photo.filename} style={{ transform: `scale(${zoom})` }} />}
      </div>
      <aside className="photo-inspector">
        <p className="eyebrow">RECOVERED MEDIA</p><h3>{photo.filename}</h3>
        <dl><div><dt>DATE</dt><dd>{photo.date}</dd></div><div><dt>DEVICE</dt><dd>{photo.device}</dd></div><div><dt>ALBUM</dt><dd>{photo.album}</dd></div><div><dt>RESOLUTION</dt><dd>{photo.resolution}</dd></div>{photo.duration && <div><dt>DURATION</dt><dd>{photo.duration}</dd></div>}</dl>
        {photo.mediaType !== 'video' && <label><ZoomIn size={15}/> ZOOM <input type="range" min="1" max="3" step=".1" value={zoom} onChange={(event) => setZoom(Number(event.target.value))}/></label>}
      </aside>
    </div>
  );
}

function PhoneContent({ view, setView }: { view: PhoneView; setView: (view: PhoneView) => void }) {
  const [selectedPhoto, setSelectedPhoto] = useState<PhonePhoto | null>(null);
  const [selectedNote, setSelectedNote] = useState<(typeof phoneNotes)[number] | null>(null);
  const [noteQuery, setNoteQuery] = useState('');
  const filteredNotes = phoneNotes.filter((note) =>
    `${note.title} ${note.content} ${note.tags?.join(' ') ?? ''}`.toLowerCase().includes(noteQuery.trim().toLowerCase()),
  );

  if (view === 'home') {
    const apps = [
      { id: 'photos', label: 'Photos', Icon: ImageIcon, tone: 'sunset' },
      { id: 'notes', label: 'Notes', Icon: FileText, tone: 'paper' },
      { id: 'phone', label: 'Phone', Icon: Phone, tone: 'green' },
      { id: 'messages', label: 'Messages', Icon: MessageCircle, tone: 'blue' },
    ] as const;
    return (
      <div className="phone-home">
        <div className="phone-wallpaper"><small>RECOVERED DEVICE</small><strong>16:04</strong><span>Tuesday, March 12</span></div>
        <div className="phone-app-grid">{apps.map(({ id, label, Icon, tone }) => <button key={id} onClick={() => setView(id)}><span className={tone}><Icon /></span><small>{label}</small></button>)}</div>
        <div className="phone-dock"><span/><span/><span/><span/></div>
      </div>
    );
  }

  return (
    <div className="phone-app">
      <div className="phone-app-header"><button onClick={() => { setView('home'); setSelectedNote(null); }}><ChevronLeft/>Home</button><strong>{view === 'photos' ? 'Photos' : view === 'notes' ? 'Notes' : view === 'phone' ? 'Phone' : 'Messages'}</strong><span /></div>
      {view === 'photos' && (
        <>
          <div className="phone-app-copy"><small>LIBRARY</small><h3>Recovered photos</h3><p>{photos.filter((item) => item.mediaType !== 'video').length} photos · {photos.filter((item) => item.mediaType === 'video').length} video</p></div>
          <div className="phone-gallery">{photos.map((photo) => <button key={photo.id} className={photo.mediaType === 'video' ? 'is-video' : ''} onClick={() => setSelectedPhoto(photo as PhonePhoto)}>{photo.mediaType === 'video' ? <><video src={`${assetUrl(photo.url)}#t=1`} muted preload="metadata" playsInline /><Play className="gallery-play" /></> : <img src={assetUrl(photo.url)} alt={photo.notes ?? photo.filename} loading="lazy" />}{(photo.mediaType === 'video' || /\d/.test(photo.date)) && <span>{photo.mediaType === 'video' ? photo.duration : photo.date.split(' ')[0]}</span>}</button>)}</div>
        </>
      )}
      {view === 'notes' && !selectedNote && (
        <>
          <div className="phone-app-copy"><small>ON MY PHONE</small><h3>Notes</h3><label className="phone-search"><Search/><input value={noteQuery} onChange={(event) => setNoteQuery(event.target.value)} placeholder="Search" /></label></div>
          <div className="phone-note-list">{filteredNotes.map((note) => <button key={note.id} onClick={() => setSelectedNote(note)}><strong>{note.title}</strong><p>{note.content.slice(0, 72)}...</p><small>{note.date}</small></button>)}{!filteredNotes.length && <div className="phone-no-results">Không tìm thấy ghi chú phù hợp.</div>}</div>
        </>
      )}
      {view === 'notes' && selectedNote && (
        <article className="phone-note-detail"><button onClick={() => setSelectedNote(null)}><ChevronLeft/>All Notes</button><small>{selectedNote.date}</small><h3>{selectedNote.title}</h3><p>{selectedNote.content}</p><div>{selectedNote.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div></article>
      )}
      {view === 'messages' && (
        <div className="phone-note-list">{messages.map((message) => <div key={message.time}><strong>{message.sender}</strong><p>{message.preview}</p><small>{message.time}</small></div>)}</div>
      )}
      {view === 'phone' && (
        <div className="phone-empty"><div><Phone/></div><h3>No recent calls</h3><p>Không có dữ liệu quan trọng được phục hồi trong ứng dụng này.</p></div>
      )}
      {selectedPhoto && <PhotoViewer photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
    </div>
  );
}

export function PhoneModule() {
  const { phoneUnlocked, puzzles, unlockPhone, soundEnabled } = useGameState();
  const [pin, setPin] = useState('');
  const pinLength = puzzles.phase1PhonePin.length;
  const [status, setStatus] = useState<'idle' | 'error' | 'opening'>('idle');
  const [view, setView] = useState<PhoneView>('home');
  const dots = useMemo(() => Array.from({ length: pinLength }, (_, index) => index < pin.length), [pin, pinLength]);

  const submit = () => {
    if (pin.length !== pinLength || status === 'opening') return;
    if (pin === puzzles.phase1PhonePin) {
      setStatus('opening');
      if (soundEnabled) playAudio.accessGranted();
      window.setTimeout(unlockPhone, 650);
    } else {
      setStatus('error');
      if (soundEnabled) playAudio.errorBuzz();
      window.setTimeout(() => { setPin(''); setStatus('idle'); }, 650);
    }
  };

  useEffect(() => {
    if (phoneUnlocked) return;
    const handler = (event: KeyboardEvent) => {
      if (/^[0-9]$/.test(event.key)) setPin((value) => value.length < pinLength ? value + event.key : value);
      if (event.key === 'Backspace') setPin((value) => value.slice(0, -1));
      if (event.key === 'Enter') submit();
      if (event.key === 'Escape') setPin('');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  return (
    <>
      <PageHeading eyebrow="DIGITAL FORENSICS / EVIDENCE EV-01" />
      <section className="device-workbench">
        <div className="phone-wrap">
          <div className={`phone-device ${status === 'error' ? 'shake' : ''} ${status === 'opening' ? 'unlocking' : ''}`}>
            <div className="phone-speaker" />
            <div className="phone-screen">
              <div className="phone-status"><span>16:04</span><div><Signal/><Wifi/><BatteryMedium/></div></div>
              {!phoneUnlocked ? (
                <div className="phone-lock">
                  <Lock size={24} />
                  <span className="lock-date">Tuesday, 12 March</span>
                  <strong>16:04</strong>
                  <div className="pin-area"><small>{status === 'error' ? 'INCORRECT PASSCODE' : status === 'opening' ? 'ACCESS GRANTED' : 'ENTER PASSCODE'}</small><div className="pin-dots">{dots.map((filled, index) => <span key={index} className={filled ? 'filled' : ''}/>)}</div></div>
                  <NumericKeypad value={pin} onChange={setPin} length={pinLength} onSubmit={submit} disabled={status !== 'idle'} />
                  <p>Device passcode required</p>
                </div>
              ) : <PhoneContent view={view} setView={setView} />}
              <div className="phone-homebar" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
