import { useEffect, useRef, useState } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Button,
  Group,
  Box,
  Stack,
  Card,
  List,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import { IconAlertTriangle, IconCheck, IconInfoCircle } from '@tabler/icons-react';

export default function Correlation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [correlationR, setCorrelationR] = useState<string>("0.00");
  const [rSquared, setRSquared] = useState<string>("0.00");
  const pointsRef = useRef<{ x: number, y: number }[]>([]);
  const draggedPointRef = useRef<{ x: number, y: number } | null>(null);

  const numPoints = 15;
  const pointRadius = 15;

  const initializePoints = (canvasWidth: number, canvasHeight: number) => {
    const newPoints = [];
    for (let i = 0; i < numPoints; i++) {
      newPoints.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight
      });
    }
    pointsRef.current = newPoints;
  };

  const calculateRegressionAndCorrelation = (data: { x: number, y: number }[]) => {
    const n = data.length;
    if (n < 2) return { a: 0, b: 0, r: 0 };

    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;

    for (let i = 0; i < n; i++) {
      sumX += data[i].x;
      sumY += data[i].y;
      sumXY += data[i].x * data[i].y;
      sumXX += data[i].x * data[i].x;
      sumYY += data[i].y * data[i].y;
    }

    const meanX = sumX / n;
    const meanY = sumY / n;

    const numeratorA = (n * sumXY - sumX * sumY);
    const denominatorA = (n * sumXX - sumX * sumX);
    
    const a = denominatorA === 0 ? 0 : numeratorA / denominatorA;
    const b = meanY - a * meanX;

    const numeratorR = (n * sumXY - sumX * sumY);
    const denominatorR = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    const r = denominatorR === 0 ? 0 : numeratorR / denominatorR;

    return { a, b, r };
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const points = pointsRef.current;

    // 回帰直線の描画
    if (points.length > 1) {
      const { a, b, r } = calculateRegressionAndCorrelation(points);
      setCorrelationR(r.toFixed(2));
      setRSquared((r * r).toFixed(2));

      ctx.beginPath();
      ctx.strokeStyle = '#228be6';
      ctx.lineWidth = 3;
      ctx.moveTo(0, a * 0 + b);
      ctx.lineTo(canvas.width, a * canvas.width + b);
      ctx.stroke();
    }

    // データポイントの描画
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, pointRadius, 0, Math.PI * 2);
      ctx.fillStyle = draggedPointRef.current === point ? '#fa5252' : '#40c057';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#212529';
      ctx.stroke();
    });
  };

  const getEventPos = (event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in event && event.touches.length > 0) {
      return {
        x: (event.touches[0].clientX - rect.left) * scaleX,
        y: (event.touches[0].clientY - rect.top) * scaleY
      };
    } else if ('clientX' in event) {
      return {
        x: ((event as MouseEvent).clientX - rect.left) * scaleX,
        y: ((event as MouseEvent).clientY - rect.top) * scaleY
      };
    }
    return { x: 0, y: 0 };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 初期化
    if (pointsRef.current.length === 0) {
      initializePoints(canvas.width, canvas.height);
    }
    draw();

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      const pos = getEventPos(event, canvas);
      for (let i = 0; i < pointsRef.current.length; i++) {
        const p = pointsRef.current[i];
        const dist = Math.sqrt(Math.pow(pos.x - p.x, 2) + Math.pow(pos.y - p.y, 2));
        if (dist < pointRadius) {
          draggedPointRef.current = p;
          break;
        }
      }
    };

    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      if (draggedPointRef.current) {
        const pos = getEventPos(event, canvas);
        draggedPointRef.current.x = pos.x;
        draggedPointRef.current.y = pos.y;
        draw();
      }
    };

    const handlePointerUp = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      draggedPointRef.current = null;
      draw();
    };

    canvas.addEventListener('mousedown', handlePointerDown);
    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('mouseup', handlePointerUp);
    canvas.addEventListener('mouseleave', handlePointerUp);

    canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
    canvas.addEventListener('touchmove', handlePointerMove, { passive: false });
    canvas.addEventListener('touchend', handlePointerUp, { passive: false });
    canvas.addEventListener('touchcancel', handlePointerUp, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', handlePointerDown);
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('mouseup', handlePointerUp);
      canvas.removeEventListener('mouseleave', handlePointerUp);

      canvas.removeEventListener('touchstart', handlePointerDown);
      canvas.removeEventListener('touchmove', handlePointerMove);
      canvas.removeEventListener('touchend', handlePointerUp);
      canvas.removeEventListener('touchcancel', handlePointerUp);
    };
  }, []);

  const handleReset = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      initializePoints(canvas.width, canvas.height);
      draw();
    }
  };

  return (
    <Container size="md" py="xl">
      <Title order={1} mb="md" c="deep-blue.9">直感！相関関係メーカー</Title>
      <Text size="lg" mb="xl">
        世の中の様々なデータには、互いに影響し合っている関係性が見られます。例えば「気温」と「アイスクリームの売上」など、一方が増えればもう一方も増える（あるいは減る）といった関係です。<br/>
        この「関係の強さと向き」を示すのが<strong>「相関係数 (r)」</strong>です。<br/><br/>
        また、相関係数を2乗したものを<strong>「決定係数 (R²)」</strong>と呼びます。<br/>
        決定係数は「結果（アイスの売上）のばらつきのうち、原因（気温）によってどれくらい説明できるか」という<strong>予測の当てはまりの良さ</strong>（0.00〜1.00）を表します。例えば R² = 0.8 なら「80%は気温で説明できる（残り20%は別の要因）」という意味になります。<br/><br/>
        下のグラフ上の点を指やマウスで自由に動かして、データ同士の結びつきの強さ（相関係数）や回帰直線、そして予測の精度（決定係数）がどのように変化するかを体験してみましょう。
      </Text>

      <Paper shadow="sm" p="md" withBorder style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
        <Box mb="md" style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
           <canvas 
            ref={canvasRef} 
            width={600} 
            height={400} 
            style={{ 
              border: '1px solid #ced4da', 
              backgroundColor: '#fff', 
              touchAction: 'none',
              maxWidth: '100%',
              borderRadius: '8px'
            }} 
          />
        </Box>
        <Group justify="space-between" w="100%" style={{ maxWidth: '600px' }}>
          <Box>
            <Text size="xl" fw={700} c="deep-blue.8">相関係数 r: {correlationR}</Text>
            <Text size="md" fw={500} c="dimmed">決定係数 R²: {rSquared}</Text>
          </Box>
          <Button onClick={handleReset} variant="outline" color="deep-blue.7">リセット</Button>
        </Group>
      </Paper>

      <Stack mt={60} gap="xl">
        <Divider
          label={
            <Group gap="xs">
              <IconInfoCircle size={20} />
              <Text fw={700}>さらに詳しく学ぶ</Text>
            </Group>
          }
          labelPosition="center"
        />

        <Paper shadow="md" p="xl" withBorder radius="lg" bg="var(--mantine-color-body)">
          <Stack gap="lg">
            <Stack gap={4}>
              <Title order={2} c="deep-blue.9">
                相関関係 vs 因果関係
              </Title>
              <Text c="dimmed" size="sm">
                Correlation vs. Causality
              </Text>
            </Stack>

            <Text size="md" lh={1.7}>
              データが連動して動いている（相関がある）からといって、必ずしも
              <strong>「一方が原因で、もう一方が結果（因果関係）」</strong>
              であるとは限りません。 統計学において、この区別は非常に重要です。
            </Text>

            <Card withBorder radius="md" p="xl" bg="var(--mantine-color-blue-light)">
              <Stack gap="md">
                <Group gap="xs">
                  <IconAlertTriangle color="var(--mantine-color-blue-filled)" />
                  <Title order={3} size="h4" c="blue.9">
                    注意！「疑似相関」の罠
                  </Title>
                </Group>

                <Text size="sm" fw={500}>
                  有名な例：アイスクリームの売上と溺水事故
                </Text>

                <Text size="sm">
                  夏になると<strong>「アイスクリームの売上が増える」</strong>
                  と同時に、<strong>「プールでの溺水事故」</strong>
                  も増える傾向があります。これらには強い正の相関が見られます。
                </Text>

                <Group grow align="stretch">
                  <Paper p="md" withBorder radius="md" bg="white">
                    <Stack gap="xs" align="center">
                      <ThemeIcon color="red" variant="light" radius="xl">
                        <IconAlertTriangle size={18} />
                      </ThemeIcon>
                      <Text fw={700} size="sm" c="red.7" ta="center">
                        誤った解釈（因果関係）
                      </Text>
                      <Text size="xs" ta="center">
                        「アイスクリームを食べることが原因で、人が溺れるようになった」
                      </Text>
                    </Stack>
                  </Paper>

                  <Paper p="md" withBorder radius="md" bg="white">
                    <Stack gap="xs" align="center">
                      <ThemeIcon color="green" variant="light" radius="xl">
                        <IconCheck size={18} />
                      </ThemeIcon>
                      <Text fw={700} size="sm" c="green.7" ta="center">
                        正しい理解（疑似相関）
                      </Text>
                      <Text size="xs" ta="center">
                        「<strong>気温の上昇</strong>という共通の原因が、両方を増やしている」
                      </Text>
                    </Stack>
                  </Paper>
                </Group>

                <Text size="xs" c="blue.8" bg="blue.0" p="xs" style={{ borderRadius: '4px' }}>
                  このように、直接の関係はないのに第三の要因（潜伏変数）によって相関があるように見える現象を
                  <strong>疑似相関 (Spurious Correlation)</strong>と呼びます。
                </Text>
              </Stack>
            </Card>

            <Box>
              <Title order={4} size="h5" mb="md">
                因果関係を見極める3つのチェック：
              </Title>
              <List
                spacing="sm"
                size="sm"
                center
                icon={
                  <ThemeIcon color="deep-blue.6" size={24} radius="xl">
                    <IconCheck size={16} />
                  </ThemeIcon>
                }
              >
                <List.Item>
                  <Text size="sm">
                    <strong>時間的順序：</strong> 原因（気温上昇）は結果（アイス売上増）の前に起きているか？
                  </Text>
                </List.Item>
                <List.Item>
                  <Text size="sm">
                    <strong>共変性：</strong> 原因が変化したとき、結果もそれに伴って変化するか？
                  </Text>
                </List.Item>
                <List.Item>
                  <Text size="sm">
                    <strong>他要因の排除：</strong> 他の理由（疑似相関）で説明できてしまわないか？
                  </Text>
                </List.Item>
              </List>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}