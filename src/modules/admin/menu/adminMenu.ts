import {
    HomeIcon,
    InboxIcon,
    UsersIcon,
    Cog6ToothIcon,
    ChartBarIcon
  } from '@heroicons/vue/24/solid';
  
  export interface SidebarItem {
    path: string;
    title: string;
    icon: any; // Puedes tipar mejor si quieres con `Component`
    roles: string[];
  }
  
  export const adminMenu: SidebarItem[] = [
    {
      path: '/admin/dashboard',
      title: 'Inicio',
      icon: HomeIcon,
      roles: ['admin', 'superadmin']
    },
    {
      path: '/admin/pedidos',
      title: 'Pedidos',
      icon: InboxIcon,
      roles: ['admin']
    },
    {
      path: '/admin/usuarios',
      title: 'Usuarios',
      icon: UsersIcon,
      roles: ['superadmin']
    },
    {
      path: '/admin/configuracion',
      title: 'Configuración',
      icon: Cog6ToothIcon,
      roles: ['admin', 'superadmin']
    },
    {
      path: '/admin/estadisticas',
      title: 'Estadísticas',
      icon: ChartBarIcon,
      roles: ['admin']
    }
  ];
  