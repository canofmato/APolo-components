import { useState } from 'react';
import { usePortfolioStore } from './store/portfolioStore';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const loadFromAI = usePortfolioStore((state) => state.loadFromAI);
  
  const handleApplyAI = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      loadFromAI(parsedData);
      alert("AI 레이아웃 적용 성공!");
    } catch (error) {
      alert("JSON 형식이 잘못되었습니다!");
    }
  };

  return (
    <div>
      <div style={{ padding: '20px', backgroundColor: '#f0f4f8', marginBottom: '20px', borderRadius: '8px', color: 'black' }}>
        <h3 style={{ marginTop: 0, color: 'black' }}>AI JSON 레이아웃 주입기</h3>
        <textarea
          style={{ width: '100%', height: '120px', padding: '10px', color: 'black', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px' }}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="여기에 JSON 코드를 붙여넣으세요..."
        />
        <button 
          onClick={handleApplyAI}
          style={{ 
            marginTop: '10px', 
            padding: '10px 20px', 
            backgroundColor: '#007BFF', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          화면에 렌더링
        </button>
      </div>

      <div>
        APolo
      </div>
    </div>
  );
}

export default App;
