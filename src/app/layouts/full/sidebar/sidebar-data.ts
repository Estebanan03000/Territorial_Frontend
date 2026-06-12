import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:atom-line-duotone',
    route: '/dashboard',
  },
  {
    displayName: 'Ciudadanos',
    iconName: 'solar:users-group-rounded-line-duotone',
    route: '/citizens/list',
  },
  {
    displayName: 'Funcionarios',
    iconName: 'solar:user-id-line-duotone',
    route: '/officials',
  },
  {
    displayName: 'Entidades',
    iconName: 'solar:buildings-3-line-duotone',
    route: '/entities/list',
  },
  {
    displayName: 'Categorías',
    iconName: 'solar:widget-2-line-duotone',
    route: '/categories/list',
  },
  {
    displayName: 'Comunas',
    iconName: 'solar:home-2-line-duotone',
    route: '/communes',
  },
  {
    displayName: 'Barrios',
    iconName: 'solar:home-2-line-duotone',
    route: '/neighborhoods/list',
  },
  {
    displayName: 'Demarcación',
    iconName: 'solar:map-point-wave-line-duotone',
    route: '/neighborhoods/demarcation',
  },
  {
    displayName: 'Reportes',
    iconName: 'solar:clipboard-text-line-duotone',
    route: '/reports',
  },
  {
    displayName: 'Anotaciones',
    iconName: 'solar:map-point-wave-line-duotone',
    route: '/annotations/list',
  },
  {
    displayName: 'Mapa',
    iconName: 'solar:map-point-wave-line-duotone',
    route: '/map',
    children: [
      {
        displayName: 'Seguimiento',
        iconName: 'tabler:point',
        route: '/map/tracking',
      },
      {
        displayName: 'Anotaciones',
        iconName: 'tabler:point',
        route: '/map/annotations',
      },
    ],
  }
]
