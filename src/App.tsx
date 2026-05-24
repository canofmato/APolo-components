import { useState } from 'react';
import { usePortfolioStore } from './store/portfolioStore';
import { PreviewRenderer } from './components/PreviewRenderer';

function App() {
  const [jsonInput, setJsonInput] = useState('');

  const loadFromAI    = usePortfolioStore((s) => s.loadFromAI);
  const template      = usePortfolioStore((s) => s.template);
  const content       = usePortfolioStore((s) => s.content);
  const previewMode   = usePortfolioStore((s) => s.previewMode);
  const setPreviewMode = usePortfolioStore((s) => s.setPreviewMode);
  const updateContentValue = usePortfolioStore((s) => s.updateContentValue);

  const handleApplyAI = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      loadFromAI(parsed);
      alert('AI 레이아웃 적용 성공!');
    } catch {
      alert('JSON 형식이 잘못되었습니다!');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f' }}>

      {/* ── 개발자용 주입기 ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 1000,
        padding: '12px 20px',
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}>
        <textarea
          style={{
            flex: 1, height: '72px', padding: '8px 12px',
            backgroundColor: '#242424', color: '#f0f0f0',
            border: '1px solid #444', borderRadius: '6px',
            fontSize: '12px', fontFamily: 'monospace', resize: 'none',
          }}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='AI가 생성한 JSON을 붙여넣고 "렌더링" 버튼을 누르세요...'
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
          <button onClick={handleApplyAI} style={btnStyle('#d4f57a', '#0f0f0f')}>
            렌더링
          </button>
          {/* 모드 토글 */}
          {template && (
            <button
              onClick={() => setPreviewMode(previewMode === 'template' ? 'filled' : 'template')}
              style={btnStyle('#333', '#f0f0f0')}
            >
              {previewMode === 'template' ? '완성 미리보기' : '편집 모드'}
            </button>
          )}
        </div>
      </div>

      {/* ── 렌더링 결과 ── */}
      <div style={{ paddingTop: '108px' }}>
        {template ? (
          <PreviewRenderer
            template={template}
            content={content}
            previewMode={previewMode}
            onContentChange={updateContentValue}
          />
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: 'calc(100vh - 108px)',
            color: '#444', fontSize: '15px',
          }}>
            위에 AI JSON을 붙여넣고 렌더링 버튼을 누르세요
          </div>
        )}
      </div>

    </div>
  );
}

// 버튼 인라인 스타일 헬퍼
function btnStyle(bg: string, color: string): React.CSSProperties {
  return {
    padding: '8px 16px',
    backgroundColor: bg,
    color,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '13px',
    whiteSpace: 'nowrap',
  };
}

export default App;
