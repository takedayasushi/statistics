import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import './App.css'

function App() {
  const [data, setData] = useState([
    { name: '平均', value: 400 },
    { name: '分散', value: 300 },
    { name: '標準偏差', value: 200 },
  ]);

  const randomize = () => {
    setData(data.map(item => ({
      ...item,
      value: Math.floor(Math.random() * 500) + 100
    })));
  }

  return (
    <div className="app-container" style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        統計図解アプリ (プロトタイプ)
      </motion.h1>
      
      <p>「動く図解本」の土台が完成しました！</p>

      <motion.div 
        style={{ width: '100%', height: 300, marginTop: '2rem' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <button 
        onClick={randomize}
        style={{ marginTop: '1rem', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#8884d8', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        データを揺らす
      </button>
    </div>
  )
}

export default App
