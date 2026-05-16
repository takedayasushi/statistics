import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AppLayout } from './components/AppShell';
import LawOfLargeNumbers from './pages/LawOfLargeNumbers';
import { Title, Text, Container, Paper, ThemeIcon, rem, Group, Stack, Button, Box, Divider } from '@mantine/core';
import { IconChartBar, IconBulb, IconWorld, IconArrowRight } from '@tabler/icons-react';

function Welcome() {
  const navigate = useNavigate();
  return (
    <Container size="lg" py="xl">
      <Stack align="center" mb={60} mt={40} gap="md">
        <Title 
          order={1} 
          size="4.5rem" 
          fw={900} 
          c="deep-blue.9" 
          ta="center"
          style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}
        >
          見えない世界を、<br />数字で透視する。
        </Title>
        <Text size="xl" c="dimmed" fw={500} ta="center" mt="md" style={{ maxWidth: '600px', lineHeight: 1.6 }}>
          私たちの周りには「偶然」を装った「必然」が隠れています。<br />
          統計学とは、そのベールを剥がし、不確実な未来を予測する<b>「現代の魔法」</b>です。
        </Text>
        <Button 
          size="xl" 
          mt="xl" 
          radius="xl" 
          color="deep-blue.7"
          rightSection={<IconArrowRight size={20} />}
          onClick={() => navigate('/law-of-large-numbers')}
          style={{ transition: 'transform 0.2s ease', '&:hover': { transform: 'scale(1.05)' } }}
        >
          最初の法則を体験する
        </Button>
      </Stack>

      <Box mb={60}>
        <Paper shadow="sm" p={40} radius="xl" withBorder bg="gray.0">
          <Group align="flex-start" wrap="nowrap" gap={40}>
            <Box style={{ flex: 1 }}>
              <Title order={2} size="2rem" mb="md" c="deep-blue.8">なぜ直感は裏切られるのか？</Title>
              <Text size="lg" lh={1.8} mb="md">
                「カジノはなぜ必ず儲かるのか？」「数人のアンケートでなぜ世論がわかるのか？」<br />
                人間の脳は、進化の過程で「統計的に考える」ようには作られませんでした。だからこそ、私たちはしばしば確率を見誤り、直感に裏切られます。
              </Text>
              <Text size="lg" lh={1.8}>
                このサイトでは、難しい数式をただ暗記するのではなく、<b>ブラウザ上で実際にシミュレーションを動かしながら</b>、サイコロやコインの背後に潜む「数学的な真実」を体感できます。
              </Text>
            </Box>
            <Box style={{ width: '300px', flexShrink: 0, textAlign: 'center' }}>
               <ThemeIcon size={120} radius="100%" variant="light" color="indigo">
                  <IconChartBar style={{ width: rem(60), height: rem(60) }} />
               </ThemeIcon>
            </Box>
          </Group>
        </Paper>
      </Box>

      <Divider my={60} label={<Text size="lg" fw={700} c="dimmed">学べる3つの力</Text>} labelPosition="center" />

      <Group grow align="stretch">
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <ThemeIcon size={60} radius="md" variant="light" color="blue" mb="lg">
            <IconChartBar style={{ width: rem(32), height: rem(32) }} />
          </ThemeIcon>
          <Title order={3} size="h4" mb="sm" c="deep-blue.9">データを見抜く眼</Title>
          <Text c="dimmed" size="md" lh={1.6}>
            少数のサンプルでは単なる「偶然」に見える出来事も、数を重ねることで美しい一つの法則へと収束していく過程を観察します。
          </Text>
        </Paper>

        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <ThemeIcon size={60} radius="md" variant="light" color="indigo" mb="lg">
            <IconBulb style={{ width: rem(32), height: rem(32) }} />
          </ThemeIcon>
          <Title order={3} size="h4" mb="sm" c="deep-blue.9">バイアスの打破</Title>
          <Text c="dimmed" size="md" lh={1.6}>
            「大数の法則」や「中心極限定理」などを通して、人間の主観的な感覚とは反する、客観的で冷徹な数学の面白さを体験します。
          </Text>
        </Paper>

        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <ThemeIcon size={60} radius="md" variant="light" color="cyan" mb="lg">
            <IconWorld style={{ width: rem(32), height: rem(32) }} />
          </ThemeIcon>
          <Title order={3} size="h4" mb="sm" c="deep-blue.9">未来を予測する力</Title>
          <Text c="dimmed" size="md" lh={1.6}>
            AIの開発、金融リスクの評価、医療データの分析。現代社会を裏側でコントロールしている統計的思考の基礎を身につけます。
          </Text>
        </Paper>
      </Group>
    </Container>
  );
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
