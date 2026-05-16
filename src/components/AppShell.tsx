import { AppShell, Burger, Group, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChartLine, IconHome2 } from '@tabler/icons-react';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <b>統計学習アプリ</b>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavLink
          href="#/"
          label="ホーム"
          leftSection={<IconHome2 size="1rem" stroke={1.5} />}
        />
        <NavLink
          href="#/law-of-large-numbers"
          label="大数の法則"
          leftSection={<IconChartLine size="1rem" stroke={1.5} />}
          active
        />
        <NavLink
          href="#/central-limit-theorem"
          label="中心極限定理 (準備中)"
          leftSection={<IconChartLine size="1rem" stroke={1.5} />}
          disabled
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
