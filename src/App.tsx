import { useState } from 'react';
import { usePortfolioStore } from './store/portfolioStore';
import { BlockEditorPage } from './BlockEditorPage';

function App() {
  const [jsonInput, setJsonInput]   = useState('');
  const [devMode, setDevMode]       = useState(true); // 개발 중엔 true
  const loadFromAI = usePortfolioStore((s) => s.loadFromAI);
  const template   = usePortfolioStore((s) => s.template);

  const handleApplyAI = () => {
    try {
      const parsed = JSON.parse(jsonInput);

      if (parsed.portfolioTemplate) {
        loadFromAI(parsed);
      } else if (parsed.blocks) {
        loadFromAI({
          portfolioTemplate: {
            id: parsed.id ?? parsed.templateId ?? `tpl-${Date.now()}`,
            title: parsed.title ?? 'Portfolio',
            version: parsed.version ?? 1,
            previewMode: 'template',
            blocks: parsed.blocks,
          },
        });
      } else {
        alert('blocks 또는 portfolioTemplate 키가 없습니다.');
        return;
      }
      setDevMode(false); // 주입 성공하면 에디터로 전환
    } catch {
      alert('JSON 형식이 잘못되었습니다!');
    }
  };

  // ── 에디터 화면 ──
  if (!devMode && template) {
    return (
      <>
        {/* 개발용 다시 주입 버튼 (우측 하단 고정) */}
        <button
          onClick={() => setDevMode(true)}
          style={{
            position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
            padding: '8px 14px',
            background: '#242424', border: '1px solid #444',
            borderRadius: '8px', color: '#a0a0a0',
            fontSize: '12px', cursor: 'pointer',
          }}
        >
          ⚙ JSON 재주입
        </button>
        <BlockEditorPage />
      </>
    );
  }

  // ── 개발용 JSON 주입기 화면 ──
  return (
    <div style={{
      minHeight: '100vh', background: '#0f0f0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: '560px', padding: '32px',
        background: '#181818', border: '1px solid #333',
        borderRadius: '12px',
      }}>
        <h2 style={{ color: '#d4f57a', fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
          APolo
        </h2>
        <p style={{ color: '#606060', fontSize: '13px', marginBottom: '20px' }}>
          AI가 생성한 JSON을 붙여넣고 에디터를 실행하세요
        </p>
        <textarea
          style={{
            width: '100%', height: '200px', padding: '12px',
            background: '#242424', color: '#f0f0f0',
            border: '1px solid #444', borderRadius: '8px',
            fontSize: '12px', fontFamily: 'monospace',
            resize: 'vertical', outline: 'none',
          }}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{ "blocks": [ ... ] } 또는 { "portfolioTemplate": { ... } }'
        />
        <button
          onClick={handleApplyAI}
          disabled={!jsonInput.trim()}
          style={{
            marginTop: '12px', width: '100%',
            padding: '12px',
            background: jsonInput.trim() ? '#d4f57a' : '#333',
            color: jsonInput.trim() ? '#0f0f0f' : '#666',
            border: 'none', borderRadius: '8px',
            fontSize: '14px', fontWeight: 700,
            cursor: jsonInput.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s',
          }}
        >
          에디터 실행 →
        </button>
      </div>
    </div>
  );
}

export default App;
