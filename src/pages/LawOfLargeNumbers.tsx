import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { Container, Title, Paper, Text, Button, Group } from '@mantine/core';
import './App.css';

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
      if (times === 1 || currentFlips <= 100 || currentFlips % Math.floor(times / 100) === 0) {
        newHistory.push({
          trial: currentFlips,
          ratio: newHeads / currentFlips
        });
      }
    }
    
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
    <Container size="md" py="xl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Title order={1} mb="lg" ta="center">大数の法則 (The Law of Large Numbers)</Title>
        
        <Paper withBorder p="xl" radius="md" mb="xl" shadow="sm">
          <Title order={2} size="h3" mb="sm">何を学ぶアプリ？</Title>
          <Text>
            コイントスで「表」が出る確率は、理論上は <strong>50% (0.5)</strong> です。
            しかし、実際に数回投げただけでは、表ばかり出たり、裏ばかり出たりして、50%にはならないことがよくあります。
          </Text>
          <Text mt="sm">
            <strong>大数の法則</strong>とは、<strong>「試行回数を増やせば増やすほど、実際の確率は理論上の確率（50%）に限りなく近づいていく」</strong>という統計学の基本法則です。
          </Text>
          <Text mt="lg" c="blue.4" fw={700}>
            👇 下のボタンを押してコインを投げ、グラフの線が「0.5」の赤い線にどう近づいていくか観察してみましょう！
          </Text>
        </Paper>
      </motion.div>

      <Group justify="center" mb="xl">
        <Button onClick={() => tossCoins(1)}>1回投げる</Button>
        <Button onClick={() => tossCoins(10)}>10回投げる</Button>
        <Button onClick={() => tossCoins(100)}>100回投げる</Button>
        <Button onClick={() => tossCoins(1000)}>1000回投げる</Button>
        <Button color="red" onClick={reset}>リセット</Button>
      </Group>

      <Paper withBorder p="md" radius="md" mb="xl" shadow="xs">
        <Group justify="space-around">
          <Text>投げた回数: <strong>{flips}</strong> 回</Text>
          <Text>表が出た回数: <strong>{heads}</strong> 回</Text>
          <Text>現在の表の割合: <strong>{flips > 0 ? (heads / flips).toFixed(4) : '0.0000'}</strong></Text>
        </Group>
      </Paper>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Paper withBorder radius="md" p="md" shadow="sm" style={{ height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={history} margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--mantine-color-dark-4)" />
              <XAxis 
                dataKey="trial" 
                type="number" 
                domain={['dataMin', 'dataMax']} 
                label={{ value: '試行回数', position: 'insideBottom', offset: -10 }} 
                stroke="var(--mantine-color-dark-1)"
              />
              <YAxis 
                domain={[0, 1]} 
                ticks={[0, 0.25, 0.5, 0.75, 1.0]} 
                label={{ value: '表の割合', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} 
                stroke="var(--mantine-color-dark-1)"
              />
              <Tooltip 
                formatter={(value: any) => [Number(value).toFixed(3), '表の割合']}
                labelFormatter={(label) => `${label}回目`}
              />
              <ReferenceLine y={0.5} stroke="var(--mantine-color-red-6)" strokeDasharray="3 3" label={{ value: '理論値 (50%)', position: 'insideTopRight', fill: 'var(--mantine-color-red-6)' }} />
              <Line 
                type="monotone" 
                dataKey="ratio" 
                stroke="var(--mantine-color-blue-5)" 
                strokeWidth={2} 
                dot={false} 
                isAnimationActive={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </motion.div>
    </Container>
  )
}

export default App;
