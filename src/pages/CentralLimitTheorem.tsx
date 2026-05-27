import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Container, Title, Paper, Text, Button, Group, Select, Slider, Card, Grid, Stack, Alert, ThemeIcon } from '@mantine/core';
import { IconInfoCircle, IconRefresh, IconPlayerPlay } from '@tabler/icons-react';

type PopulationType = 'uniform' | 'dice' | 'coin' | 'exponential';

interface DistributionConfig {
  name: string;
  min: number;
  max: number;
  expectedMean: number;
  generateOne: () => number;
  formatValue: (v: number) => string;
}

const DISTRIBUTIONS: Record<PopulationType, DistributionConfig> = {
  uniform: {
    name: '一様分布 (0〜100の乱数)',
    min: 0,
    max: 100,
    expectedMean: 50,
    generateOne: () => Math.random() * 100,
    formatValue: (v) => v.toFixed(1),
  },
  dice: {
    name: 'サイコロ投げ (1〜6)',
    min: 1,
    max: 6,
    expectedMean: 3.5,
    generateOne: () => Math.floor(Math.random() * 6) + 1,
    formatValue: (v) => v.toFixed(2),
  },
  coin: {
    name: 'コイン投げ (0:裏, 1:表)',
    min: 0,
    max: 1,
    expectedMean: 0.5,
    generateOne: () => (Math.random() < 0.5 ? 0 : 1),
    formatValue: (v) => `${(v * 100).toFixed(0)}%`,
  },
  exponential: {
    name: '指数分布 (期待値20、右に極端に歪んだ分布)',
    min: 0,
    max: 80, // 表示限界
    expectedMean: 20,
    generateOne: () => -Math.log(1 - Math.random()) * 20,
    formatValue: (v) => v.toFixed(1),
  },
};

export default function CentralLimitTheorem() {
  const [populationType, setPopulationType] = useState<PopulationType>('dice');
  const [sampleSize, setSampleSize] = useState<number>(10);
  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [lastSample, setLastSample] = useState<number[]>([]);
  const [lastMean, setLastMean] = useState<number | null>(null);

  const config = DISTRIBUTIONS[populationType];

  // 標本平均データをヒストグラムのビンに変換
  const chartData = useMemo(() => {
    const binCount = 25;
    const { min, max } = config;
    const range = max - min;
    const binWidth = range / binCount;

    // ビン枠の初期化
    const bins = Array.from({ length: binCount }, (_, i) => {
      const bMin = min + i * binWidth;
      const bMax = bMin + binWidth;
      return {
        binMin: bMin,
        binMax: bMax,
        label: `${bMin.toFixed(1)}〜${bMax.toFixed(1)}`,
        count: 0,
      };
    });

    // 各標本平均をカウント
    sampleMeans.forEach((mean) => {
      // 範囲を外れた場合のクリッピング
      const val = Math.min(Math.max(mean, min), max - 0.0001);
      const binIndex = Math.floor((val - min) / binWidth);
      if (bins[binIndex]) {
        bins[binIndex].count++;
      }
    });

    return bins;
  }, [sampleMeans, config]);

  // サンプリングの実行
  const runSampling = (times: number) => {
    const newMeans: number[] = [];
    let finalSample: number[] = [];
    let finalMean = 0;

    for (let t = 0; t < times; t++) {
      const currentSample: number[] = [];
      let sum = 0;
      for (let s = 0; s < sampleSize; s++) {
        const val = config.generateOne();
        currentSample.push(val);
        sum += val;
      }
      const mean = sum / sampleSize;
      newMeans.push(mean);

      // 最後の1回分だけ詳細を保持する
      if (t === times - 1) {
        finalSample = currentSample;
        finalMean = mean;
      }
    }

    setSampleMeans((prev) => [...prev, ...newMeans]);
    if (times === 1) {
      setLastSample(finalSample);
      setLastMean(finalMean);
    } else {
      // 一括の場合は詳細表示をクリアまたは最新の1件に
      setLastSample(finalSample);
      setLastMean(finalMean);
    }
  };

  const handleReset = () => {
    setSampleMeans([]);
    setLastSample([]);
    setLastMean(null);
  };

  const handleDistributionChange = (value: string | null) => {
    if (value) {
      setPopulationType(value as PopulationType);
      setSampleMeans([]);
      setLastSample([]);
      setLastMean(null);
    }
  };

  return (
    <Container size="md" py="xl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Title order={1} mb="lg" ta="center" c="deep-blue.9">
          中心極限定理 (Central Limit Theorem)
        </Title>

        <Paper withBorder p="xl" radius="md" mb="xl" shadow="sm" bg="white">
          <Title order={2} size="h3" mb="sm" c="deep-blue.8">
            中心極限定理とは？
          </Title>
          <Text mb="sm" lh={1.7}>
            <strong>中心極限定理 (CLT)</strong> は、統計学において最も美しく、そして最も強力な定理です。
          </Text>
          <Text mb="sm" lh={1.7}>
            元々の母集団が<b>「どんなに歪んだ分布」</b>であっても、そこからランダムにサンプリングしたデータの「平均値（標本平均）」の分布は、サンプルサイズ（$n$）を増やすほどに、美しい<b>「正規分布（ベルカーブ）」に近づいていく</b>という不思議な数学の性質を持っています。
          </Text>
          <Text mb="md" lh={1.7}>
            このアプリでは、サイコロやコイン、指数分布など、全く異なる元の形からデータをサンプリングし、その「平均値」をプロットしていくことで、すべてが同じ山型の「正規分布」へ収束していく奇跡をその目で体感できます！
          </Text>
        </Paper>
      </motion.div>

      <Grid mb="xl">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card withBorder radius="md" shadow="xs" h="100%">
            <Title order={3} size="h4" mb="md" c="deep-blue.7">
              1. 母集団分布の選択
            </Title>
            <Select
              label="母集団（元のデータの分布）"
              placeholder="分布を選択してください"
              data={[
                { value: 'dice', label: 'サイコロ投げ (1〜6の離散一様分布)' },
                { value: 'uniform', label: '一様分布 (0〜100の完全ランダム)' },
                { value: 'coin', label: 'コイン投げ (0か1の二項分布)' },
                { value: 'exponential', label: '指数分布 (期待値20の極端な右歪み)' },
              ]}
              value={populationType}
              onChange={handleDistributionChange}
              mb="md"
            />
            <Alert icon={<IconInfoCircle size="1.2rem" />} title="元の分布の特徴" color="blue" variant="light">
              <Text size="sm">
                現在の選択: <strong>{config.name}</strong><br />
                理論上の平均値: <strong>{config.expectedMean}</strong>
              </Text>
              {populationType === 'exponential' && (
                <Text size="xs" mt="xs" c="dimmed">
                  ※指数分布は最初は0付近に極端にデータが集中し、たまに巨大な値が出る、非対称で最も「正規分布」から遠い分布の一つです。
                </Text>
              )}
            </Alert>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card withBorder radius="md" shadow="xs" h="100%">
            <Title order={3} size="h4" mb="md" c="deep-blue.7">
              2. サンプルサイズ ($n$) の調整
            </Title>
            <Text size="sm" mb="md">
              1回の試行において、「何個のデータをサンプリングしてその平均をとるか」を決定します。
              （$n$ が大きいほど、標本平均の分布は中心に鋭く集まります）
            </Text>
            <Stack gap="xs" mt="lg">
              <Text size="sm" fw={700}>
                サンプルサイズ $n$ = {sampleSize}
              </Text>
              <Slider
                value={sampleSize}
                onChange={setSampleSize}
                min={2}
                max={100}
                marks={[
                  { value: 2, label: '2 (極小)' },
                  { value: 10, label: '10' },
                  { value: 30, label: '30 (中規模)' },
                  { value: 100, label: '100 (大規模)' },
                ]}
                mb="xl"
                color="indigo"
              />
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      <Card withBorder radius="md" shadow="xs" mb="xl">
        <Title order={3} size="h4" mb="md" c="deep-blue.7" ta="center">
          3. サンプリングを実行する
        </Title>
        <Group justify="center" gap="md">
          <Button
            size="md"
            variant="light"
            color="blue"
            leftSection={<IconPlayerPlay size={18} />}
            onClick={() => runSampling(1)}
          >
            1回サンプリング
          </Button>
          <Button
            size="md"
            variant="light"
            color="indigo"
            leftSection={<IconPlayerPlay size={18} />}
            onClick={() => runSampling(10)}
          >
            10回まとめて実行
          </Button>
          <Button
            size="md"
            color="indigo"
            leftSection={<IconPlayerPlay size={18} />}
            onClick={() => runSampling(100)}
          >
            100回実行
          </Button>
          <Button
            size="md"
            color="teal"
            leftSection={<IconPlayerPlay size={18} />}
            onClick={() => runSampling(1000)}
          >
            1000回一気に実行！
          </Button>
          <Button
            size="md"
            variant="outline"
            color="red"
            leftSection={<IconRefresh size={18} />}
            onClick={handleReset}
          >
            リセット
          </Button>
        </Group>
      </Card>

      {lastMean !== null && (
        <Paper withBorder p="md" radius="md" mb="xl" shadow="xs" bg="gray.0">
          <Title order={4} size="h5" mb="xs" c="indigo.8">
            直近のサンプリング詳細
          </Title>
          <Text size="sm">
            母集団からランダムに抽出された <strong>{sampleSize}個</strong> のデータ ($n$={sampleSize}):
          </Text>
          <Text
            size="sm"
            bg="white"
            p="xs"
            my="xs"
            style={{ borderRadius: '4px', border: '1px solid #e0e0e0', wordBreak: 'break-all' }}
            fw={500}
          >
            [ {lastSample.map((v) => config.formatValue(v)).join(', ')} ]
          </Text>
          <Text size="md" fw={700} c="indigo.9">
            ⇒ この標本の平均値（標本平均） = {config.formatValue(lastMean)} （これを下のヒストグラムにプロットしました）
          </Text>
        </Paper>
      )}

      <Paper withBorder radius="md" p="xl" shadow="sm" bg="white" mb="xl">
        <Group justify="space-between" mb="lg">
          <div>
            <Title order={3} size="h4" c="deep-blue.8">
              標本平均のヒストグラム (分布図)
            </Title>
            <Text size="xs" c="dimmed">
              ※計算された標本平均が、各範囲に何回含まれたかを集計した度数分布表です。
            </Text>
          </div>
          <Card p="xs" withBorder bg="blue.0" style={{ borderWidth: '2px' }}>
            <Text size="sm" fw={700} c="blue.9">
              蓄積された標本平均の数: {sampleMeans.length} 回
            </Text>
          </Card>
        </Group>

        {sampleMeans.length === 0 ? (
          <Stack align="center" justify="center" h={300} bg="gray.0" style={{ borderRadius: '8px' }}>
            <ThemeIcon size="xl" radius="md" variant="light" color="blue">
              <IconInfoCircle size={30} />
            </ThemeIcon>
            <Text fw={700} c="dimmed">
              上のボタンを押して、サンプリングを試行してください
            </Text>
            <Text size="xs" c="dimmed">
              （まずは「1000回一気に実行！」を数回押すと、一気に綺麗な正規分布が現れます！）
            </Text>
          </Stack>
        ) : (
          <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" fontSize={11} interval={2} tickLine={false} />
                <YAxis label={{ value: '度数 (回数)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--mantine-color-indigo-6)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Paper>

      <Paper withBorder p="xl" radius="md" shadow="sm" bg="indigo.0">
        <Title order={3} size="h4" mb="sm" c="indigo.9">
          💡 観察のポイント
        </Title>
        <Stack gap="xs">
          <Text size="sm" lh={1.6}>
            1. <strong>分布による違い</strong>: 最初は「指数分布」や「コイン投げ」を選択して、1000回ボタンを押してみてください。元の分布は極端に左に偏っていたり（指数）、0か1（コイン）しか無いはずなのに、平均値をとると**なぜか綺麗な富士山型の山（正規分布）**が真ん中（期待値）付近に出来上がるのが観察できます。
          </Text>
          <Text size="sm" lh={1.6}>
            2. <strong>サンプルサイズの影響</strong>: サンプルサイズ $n$ を 「2」 の時と「50」の時で比較してみましょう。$n$ が大きくなればなるほど、ヒストグラムの山はより**シャープ（幅が狭く、鋭い山）**になります。これは、サンプル数が増えるほど「平均値のブレ（標準誤差）」が小さくなり、予測精度が跳ね上がることを意味しています。
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}
