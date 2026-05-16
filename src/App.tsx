import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/AppShell';
import LawOfLargeNumbers from './pages/LawOfLargeNumbers';
import { Title } from '@mantine/core';

function Welcome() {
  return <Title>ようこそ！左のメニューから学習したい項目を選んでください。</Title>
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Welcome />} />
          <Route path="law-of-large-numbers" element={<LawOfLargeNumbers />} />
          {/* 他のページもここに追加 */}
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
