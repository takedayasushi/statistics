import { AppShell, Burger, Group, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChartLine, IconHome2 } from '@tabler/icons-react';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ 
        width: 300, 
        breakpoint: 'sm', 
        collapsed: { mobile: !opened } 
      }}
      padding="md"
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.gray[0],
        }
      })}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <b>統計学習アプリ</b>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar 
        p="md"
        style={{
          width: '70%',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(5px)',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
        }}
      >
        <NavLink
          href="#/"
          label="ホーム"
          leftSection={<IconHome2 size="1rem" stroke={1.5} />}
          onClick={close}
        />
        <NavLink
          href="#/law-of-large-numbers"
          label="大数の法則"
          leftSection={<IconChartLine size="1rem" stroke={1.5} />}
          onClick={close}
        />
        <NavLink
          href="#/correlation"
          label="直感！相関関係メーカー"
          leftSection={<IconChartLine size="1rem" stroke={1.5} />}
          onClick={close}
        />
        <NavLink
          href="#/central-limit-theorem"
          label="中心極限定理"
          leftSection={<IconChartLine size="1rem" stroke={1.5} />}
          onClick={close}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
