import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import './App.css'

function App() {
  const [flips, setFlips] = useState(0);
  const [heads, setHeads] = useState(0);
  const [history, setHistory] = useState<{ trial: number; ratio: number }[]>([]);

  const tossCoins = (times: number) => {
    let newHeads = heads;
    let currentFlips = flips;
    const newHistory = [...history];

    for (let i = 0; i < times; i++) {
      currentFlips++;
      if (Math.random() < 0.5) {
        newHeads++;
      }
      // チャートが重くならないよう、適度に間引いて記録（または全て記録）
      if (times === 1 || currentFlips % Math.max(1, Math.floor(times / 10)) === 0) {
        newHistory.push({
          trial: currentFlips,
          ratio: newHeads / currentFlips
        });
      }
    }
    
    // 最終的な比率は必ず記録
    if (newHistory.length === 0 || newHistory[newHistory.length - 1].trial !== currentFlips) {
       newHistory.push({
          trial: currentFlips,
          ratio: newHeads / currentFlips
        });
    }

    setHeads(newHeads);
    setFlips(currentFlips);
    setHistory(newHistory);
  };

  const reset = () => {
    setFlips(0);
    setHeads(0);
    setHistory([]);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif', color: '#333' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ borderBottom: '2px solid #8884d8', paddingBottom: '0.5rem' }}>大数の法則 (Law of Large Numbers)</h1>
        
        <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', lineHeight: '1.6' }}>
          <h2 style={{ fontSize: '1.2rem', marginTop: 0 }}>何を学ぶアプリ？</h2>
          <p>
            コイントスで「表」が出る確率は、理論上は <strong>50% (0.5)</strong> です。
            しかし、実際に数回投げただけでは、表ばかり出たり、裏ばかり出たりして、50%にはならないことがよくあります。
          </p>
          <p>
            <strong>大数の法則</strong>とは、<strong>「試行回数を増やせば増やすほど、実際の確率は理論上の確率（50%）に限りなく近づいていく」</strong>という統計学の基本法則です。
          </p>
          <p style={{ fontWeight: 'bold', color: '#8884d8' }}>
            👇 下のボタンを押してコインを投げ、グラフの線が「0.5」の赤い線にどう近づいていくか観察してみましょう！
          </p>
        </div>
      </motion.div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <button onClick={() => tossCoins(1)} style={btnStyle}>1回投げる</button>
        <button onClick={() => tossCoins(10)} style={btnStyle}>10回投げる</button>
        <button onClick={() => tossCoins(100)} style={btnStyle}>100回投げる</button>
        <button onClick={() => tossCoins(1000)} style={btnStyle}>1000回投げる</button>
        <button onClick={reset} style={{ ...btnStyle, backgroundColor: '#dc3545' }}>リセット</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
        <span>投げた回数: {flips} 回</span>
        <span>表が出た回数: {heads} 回</span>
        <span>現在の表の割合: {flips > 0 ? (heads / flips).toFixed(4) : '0.0000'}</span>
      </div>

      <motion.div 
        style={{ width: '100%', height: 400, backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <ResponsiveContainer>
          <LineChart data={history} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="trial" 
              type="number" 
              domain={['dataMin', 'dataMax']} 
              label={{ value: '試行回数', position: 'insideBottom', offset: -10 }} 
            />
            <YAxis 
              domain={[0, 1]} 
              ticks={[0, 0.25, 0.5, 0.75, 1.0]} 
              label={{ value: '表の出る割合', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} 
            />
            <Tooltip 
              formatter={(value: any) => [Number(value).toFixed(3), '表の割合']}
              labelFormatter={(label) => `${label}回目`}
            />
            <ReferenceLine y={0.5} stroke="red" strokeDasharray="3 3" label={{ value: '理論値 (50%)', position: 'insideTopRight', fill: 'red' }} />
            <Line 
              type="monotone" 
              dataKey="ratio" 
              stroke="#8884d8" 
              strokeWidth={2} 
              dot={false} 
              isAnimationActive={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}

const btnStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontWeight: 'bold',
  transition: 'background-color 0.2s'
}

export default App
