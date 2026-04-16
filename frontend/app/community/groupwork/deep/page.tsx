
"use client";
import React, { useState } from "react";
import PageHero from "../../../../components/common/PageHero";


// ファイルカードUIコンポーネント
type FileCardProps = {
  file: any;
  onDelete: () => void;
  onRename: (newName: string) => void;
  onDragStart?: (file: any) => void;
  onDrop?: (file: any) => void;
  draggable?: boolean;
};
function FileCard(props: FileCardProps) {
  const { file, onDelete, onRename } = props;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(file.name);
  const [showPreview, setShowPreview] = useState(false);
  // アイコン決定
  let icon = "📄";
  if (file.type === "image") icon = "🖼️";
  else if (file.type === "text") icon = "📄";
  else if (file.type === "vector") icon = "✏️";
  else if (file.type === "pdf") icon = "📕";
  else if (file.type === "doc") icon = "📝";

  // 拡張子取得
  const ext = file.name.split('.').pop()?.toUpperCase() || "";

  return (
    <div
      className="group border border-gray-700/40 rounded-xl bg-gray-800/60 p-6 flex flex-col items-center justify-center relative hover:shadow-lg hover:border-indigo-400/60 transition-all duration-200"
      draggable
      onDragStart={() => props.onDragStart?.(file)}
      onDragOver={e => e.preventDefault()}
      onDrop={e => props.onDrop?.(file)}
    >
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-lg"
        title="削除"
        onClick={onDelete}
      >✕</button>
      <button
        className="absolute top-2 left-2 text-gray-400 hover:text-indigo-400 text-lg"
        title="拡大プレビュー"
        onClick={() => setShowPreview(true)}
      >🔍</button>
      <div className="text-5xl mb-2" title={file.type}>{icon}</div>
      {editing ? (
        <input
          className="text-gray-200 font-semibold mb-1 bg-gray-700/60 rounded px-2 py-1 text-center w-32"
          value={name}
          autoFocus
          onChange={e => setName(e.target.value)}
          onBlur={() => { setEditing(false); onRename(name); }}
          onKeyDown={e => { if (e.key === 'Enter') { setEditing(false); onRename(name); }}}
        />
      ) : (
        <div
          className="text-gray-200 font-semibold mb-1 cursor-pointer hover:underline"
          title="クリックでファイル名編集"
          onClick={() => setEditing(true)}
        >{file.name}</div>
      )}
      <div className="text-xs text-gray-400 mb-1">{file.type} <span className="ml-2 text-gray-500">[{ext}]</span></div>
      {/* プレビュー */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setShowPreview(false)}>
          <div className="bg-gray-900 rounded-xl p-8 min-w-[300px] min-h-[200px] flex flex-col items-center relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-2xl" onClick={() => setShowPreview(false)}>✕</button>
            <div className="text-7xl mb-4">{icon}</div>
            <div className="text-gray-100 text-lg font-bold mb-2">{file.name}</div>
            <div className="text-gray-400 text-sm mb-2">{file.type} [{ext}]</div>
            <div className="my-4">
              {file.type === "image" && file.content && (
                <img src={file.content} alt={file.name} className="max-w-xs max-h-60 rounded shadow" />
              )}
              {(file.type === "text" || file.type === "doc") && file.content && (
                <pre className="bg-gray-800 text-gray-100 p-3 rounded max-w-xs max-h-60 overflow-auto text-sm whitespace-pre-wrap">{file.content}</pre>
              )}
              {file.type === "audio" && file.content && (
                <audio controls className="max-w-xs">
                  <source src={file.content} />
                  お使いのブラウザは audio タグをサポートしていません。
                </audio>
              )}
              {file.type === "video" && file.content && (
                <video controls className="max-w-xs max-h-60 rounded shadow">
                  <source src={file.content} />
                  お使いのブラウザは video タグをサポートしていません。
                </video>
              )}
              {!(file.type === "image" || file.type === "text" || file.type === "doc" || file.type === "audio" || file.type === "video") && (
                <span className="text-gray-500 text-xs">プレビュー未対応</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// モックデータ
const mockFiles = [
  { id: "f1", name: "main.psd", type: "image", content: "https://placehold.co/400x300?text=main.psd" },
  { id: "f2", name: "draft.png", type: "image", content: "https://placehold.co/400x300?text=draft.png" },
  { id: "f3", name: "project.md", type: "doc", content: "# Project\n\nThis is a sample markdown file." },
  { id: "f4", name: "素材.ai", type: "vector", content: "(vector data)" },
  { id: "f5", name: "notes.txt", type: "text", content: "メモ内容のサンプルです。\n複数行テキストもOK。" },
  { id: "f6", name: "sample.mp3", type: "audio", content: "https://www.w3schools.com/html/horse.mp3" },
  { id: "f7", name: "movie.mp4", type: "video", content: "https://www.w3schools.com/html/mov_bbb.mp4" }
];
const mockWorkspace = [
  { id: "w1", name: "main.psd", type: "image" }
];
const mockChat = [
  { id: 1, user: "花子", text: "このレイヤーの色味を調整できますか？", lang: "ja" },
  { id: 2, user: "太郎", text: "Can you adjust the color tone of this layer?", lang: "en" }
];

const DeepGroupWorkPage: React.FC = () => {
    // タイムライン用
    const [timelineClips, setTimelineClips] = useState<any[]>([]);
    // タイムラインへのドロップ
    const handleTimelineDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (draggedFile && !timelineClips.some(f => f.id === draggedFile.id)) {
        setTimelineClips([...timelineClips, draggedFile]);
      }
      setDraggedFile(null);
    };
    const handleTimelineDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    };
  const [files, setFiles] = useState(mockFiles); // エクスプローラ用
  const [workspaceFiles, setWorkspaceFiles] = useState(mockFiles); // 中央作業スペース用
  const [chat, setChat] = useState(mockChat);
  const [draggedFile, setDraggedFile] = useState<any>(null);
  const [input, setInput] = useState("");

  // ドラッグ&ドロップ
  const handleDragStart = (file: any) => setDraggedFile(file);
  const handleDrop = () => {
    if (draggedFile) {
      // workspaceFilesに同じIDがなければ追加
      if (!workspaceFiles.some(f => f.id === draggedFile.id)) {
        // filesからcontentをコピー
        const fullFile = files.find(f => f.id === draggedFile.id) || draggedFile;
        setWorkspaceFiles([...workspaceFiles, fullFile]);
      }
    }
    setDraggedFile(null);
  };

  // チャット送信
  const handleSend = () => {
    if (input.trim()) {
      setChat([...chat, { id: chat.length + 1, user: "自分", text: input, lang: "ja" }]);
      setInput("");
    }
  };


  // ローカルファイルアップロード
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    // 拡張子からtype推定
    let type = "other";
    if (file.type.startsWith("image/")) type = "image";
    else if (file.type.startsWith("text/")) type = "text";
    else if (file.type.includes("pdf")) type = "pdf";
    else if (file.name.endsWith(".ai")) type = "vector";
    else if (file.name.endsWith(".md")) type = "doc";
    const newFile = { id: `f${files.length + 1}`, name: file.name, type, content: "" };
    setFiles([...files, newFile]);
    setWorkspaceFiles([...workspaceFiles, newFile]);
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col relative">
      <div className="border-b border-gray-700 bg-gray-800/80 px-6 py-3 flex items-center justify-between">
        <div className="text-xl font-bold text-indigo-300 tracking-widest">GROUP WORKSPACE</div>
        <div className="flex gap-4">
          <button className="text-gray-300 hover:text-indigo-400">保存</button>
          <button className="text-gray-300 hover:text-indigo-400">履歴</button>
          <button className="text-gray-300 hover:text-indigo-400">設定</button>
        </div>
      </div>
      <div className="flex flex-1">
        {/* 左：エクスプローラ */}
        <aside className="w-1/5 min-w-[180px] bg-gray-800/80 border-r border-gray-700 p-4 flex flex-col">
          <div className="font-semibold text-gray-200 mb-3">エクスプローラ</div>
          <div className="mb-3">
            <label className="block text-sm text-gray-300 mb-1">ローカルからファイル追加</label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-100 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
          </div>
          <ul className="space-y-2 flex-1 overflow-y-auto">
            {files.map((file) => (
              <li
                key={file.id}
                draggable
                onDragStart={() => handleDragStart(file)}
                className="px-3 py-2 bg-gray-700/60 rounded-lg text-gray-100 cursor-move hover:bg-indigo-700/30 transition-all"
              >
                <span className="mr-2">📄</span>{file.name}
              </li>
            ))}
          </ul>
        </aside>
        {/* 中央：作業スペース */}
        <main className="flex-1 bg-gray-900/80 p-6 flex flex-col pt-4" onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
          {/* タイトル */}
          <div className="mb-2">
            <PageHero title="Workspace Hub" subtitle="Access and manage all your files" backgroundOpacity={0} />
          </div>
          {/* ツールバー（タイトル直下） */}
          <div className="flex flex-wrap gap-2 px-2 py-2 mb-4 bg-gray-800/70 rounded-lg shadow sticky top-22 z-30">
            <button className="flex items-center gap-1 px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-all text-sm" onClick={() => alert('新規作成')}>🆕<span>新規作成</span></button>
            <button className="flex items-center gap-1 px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition-all text-sm" onClick={() => alert('アップロード')}>⬆️<span>アップロード</span></button>
            <button className="flex items-center gap-1 px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 transition-all text-sm" onClick={() => alert('並び替え')}>🔀<span>並び替え</span></button>
            <button className="flex items-center gap-1 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-all text-sm" onClick={() => alert('一括削除')}>🗑️<span>一括削除</span></button>
            <button className="flex items-center gap-1 px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 transition-all text-sm" onClick={() => alert('検索')}>🔎<span>検索</span></button>
            <button className="flex items-center gap-1 px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 transition-all text-sm" onClick={() => alert('コメント')}>💬<span>コメント</span></button>
            <button className="flex items-center gap-1 px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 transition-all text-sm" onClick={() => alert('履歴')}>🕑<span>履歴</span></button>
            <button className="flex items-center gap-1 px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 transition-all text-sm" onClick={() => alert('タスク')}>✅<span>タスク</span></button>
            <button className="flex items-center gap-1 px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 transition-all text-sm" onClick={() => alert('権限')}>🔒<span>権限</span></button>
            <button className="flex items-center gap-1 px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 transition-all text-sm" onClick={() => alert('外部連携')}>🌐<span>連携</span></button>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-6">
            {workspaceFiles.length > 0 ? (
              workspaceFiles.map((file, idx) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onDelete={() => setWorkspaceFiles(workspaceFiles.filter(f => f.id !== file.id))}
                  onRename={(newName: string) => setWorkspaceFiles(workspaceFiles.map(f => f.id === file.id ? { ...f, name: newName } : f))}
                  onDragStart={() => setDraggedFile(file)}
                  onDrop={targetFile => {
                    if (!draggedFile || draggedFile.id === targetFile.id) return;
                    // 並び替え: draggedFileをtargetFileの位置に移動
                    const newFiles = workspaceFiles.filter(f => f.id !== draggedFile.id);
                    const targetIdx = newFiles.findIndex(f => f.id === targetFile.id);
                    newFiles.splice(targetIdx, 0, draggedFile);
                    setWorkspaceFiles(newFiles);
                    setDraggedFile(null);
                  }}
                  draggable
                />
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500 py-12">No files in workspace</div>
            )}
          </div>
          {/* タイムライン等のスペース */}
          <div className="mt-6 p-4 bg-gray-800/60 rounded-xl shadow min-h-20 flex flex-col gap-4">
            <span className="text-gray-400">After Effects風タイムライン操作サンプル</span>
            {/* タイムラインバー（目盛り・再生ヘッド・レイヤー） */}
            <div className="relative w-full overflow-x-auto bg-gray-900 rounded p-4" style={{minHeight:'120px'}} onDrop={handleTimelineDrop} onDragOver={handleTimelineDragOver}>
              {/* 目盛り */}
              <div className="flex gap-0.5 mb-2">
                {[...Array(21)].map((_,i)=>(
                  <div key={i} className="w-8 h-6 flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-gray-500" />
                    <span className="text-xs text-gray-400">{i}s</span>
                  </div>
                ))}
              </div>
              {/* 再生ヘッド（赤線、ドラッグで移動可能なダミー） */}
              <div className="absolute top-0 left-32 w-0.5 h-full bg-red-500 z-10" style={{left:'160px'}} title="再生ヘッド（ドラッグで移動可）"></div>
              {/* レイヤー（動画・音楽クリップ） */}
              <div className="flex flex-col gap-2 mt-6">
                {timelineClips.length === 0 && (
                  <div className="text-gray-500 text-sm">作業スペースからドラッグ&ドロップで追加できます</div>
                )}
                {/* タイムライン上のクリップ */}
                {timelineClips.map(clip => (
                  <div key={clip.id} className="flex items-center gap-2">
                    <div className={
                      clip.type === "video"
                        ? "bg-indigo-700/60 rounded shadow flex items-center px-2 py-1 cursor-move"
                        : clip.type === "audio"
                        ? "bg-green-700/60 rounded shadow flex items-center px-2 py-1 cursor-move"
                        : "bg-gray-700/60 rounded shadow flex items-center px-2 py-1 cursor-move"
                    } style={{width:'128px'}} title="ドラッグで移動可">
                      <span className="text-xs text-white">{clip.type === "video" ? "動画クリップ" : clip.type === "audio" ? "音楽クリップ" : "クリップ"}</span>
                    </div>
                    <span className="text-xs text-gray-300">{clip.name}</span>
                    <button className="ml-2 px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-red-600" title="分割">分割</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        {/* 右：リアルタイム翻訳チャット */}
        <aside className="w-1/4 min-w-[220px] bg-gray-800/80 border-l border-gray-700 p-0 flex flex-col relative min-h-full">
          <div className="flex flex-col h-full">
            {/* チャット履歴 */}
            <div className="flex-1 overflow-y-auto p-4">
              {chat.map((msg) => (
                <div key={msg.id} className="mb-2">
                  <span className="font-bold text-indigo-300 mr-2">{msg.user}:</span>
                  <span className="text-gray-100">{msg.text}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
        {/* チャット入力欄を画面下部にグローバル固定 */}
        <div className="fixed bottom-0 right-0 w-1/4 min-w-[220px] z-50 bg-gray-900/90 border-t border-gray-700 flex gap-2 p-2">
          <input
            className="flex-1 px-3 py-2 rounded-lg bg-gray-700/50 text-gray-100 border border-gray-600/40 focus:outline-none"
            placeholder="メッセージを入力..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          />
          <button onClick={handleSend} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">送信</button>
        </div>
      </div>
    </div>
  );
};

export default DeepGroupWorkPage;
