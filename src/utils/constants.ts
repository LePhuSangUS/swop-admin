import { IMenus } from 'types';

export const ROLE_TYPE = {
  ADMIN: 'admin',
  DEFAULT: 'admin',
  DEVELOPER: 'developer',
};

export const CANCEL_REQUEST_MESSAGE = 'cancel request';

const menus: IMenus = [
  {
    id: '1',
    icon: 'dashboard',
    name: 'Dashboard',
    route: '/dashboard',
  },
  {
    id: '11',
    menuParentId: '-1',
    breadcrumbParentId: '1',
    name: 'Websocket',
    route: '/ws',
  },
  {
    id: '2',
    breadcrumbParentId: '1',
    name: 'Users',
    icon: 'user',
    route: '/users',
  },
  {
    id: '21',
    menuParentId: '-1',
    breadcrumbParentId: '2',
    name: 'User Detail',
    route: '/users/:id',
  },
  {
    id: '3',
    breadcrumbParentId: '1',
    name: 'Dresses',
    icon: 'skin',
    route: '/dresses',
  },
  {
    id: '31',
    menuParentId: '-1',
    breadcrumbParentId: '3',
    name: 'Dress Details',
    route: '/dresses/:id',
  },
  {
    id: '4',
    breadcrumbParentId: '1',
    name: 'Laundries',
    icon: 'shop',
    route: '/laundries',
  },
  {
    id: '41',
    menuParentId: '-1',
    breadcrumbParentId: '4',
    name: 'Laundry Details',
    route: '/laundries/:id',
  },
  {
    id: '5',
    breadcrumbParentId: '1',
    name: 'Swops',
    icon: 'interaction',
    route: '/swops',
  },
  {
    id: '51',
    menuParentId: '-1',
    breadcrumbParentId: '5',
    name: 'Swop Details',
    route: '/swops/:id',
  },
  {
    id: '6',
    breadcrumbParentId: '1',
    name: 'Matchings',
    icon: 'team',
    route: '/matchings',
  },
  {
    id: '61',
    menuParentId: '-1',
    breadcrumbParentId: '6',
    name: 'Matching Details',
    route: '/matchings/:id',
  },
  {
    id: '7',
    breadcrumbParentId: '1',
    name: 'Deliveries',
    icon: 'shopping-cart',
    route: '/deliveries',
  },
  {
    id: '71',
    menuParentId: '-1',
    breadcrumbParentId: '7',
    name: 'Delivery Details',
    route: '/deliveries/:id',
  },
  {
    id: '7.8',
    breadcrumbParentId: '1',
    name: 'Logistics',
    icon: 'car',
    route: '/logistics',
  },
  {
    id: '8',
    breadcrumbParentId: '1',
    name: 'Looks',
    icon: 'woman',
    route: '/looks',
  },
  {
    id: '81',
    menuParentId: '-1',
    breadcrumbParentId: '8',
    name: 'Look Details',
    route: '/looks/:id',
  },
  {
    id: '9',
    breadcrumbParentId: '1',
    name: 'Collections',
    icon: 'database',
    route: '/collections',
  },
  {
    id: '91',
    menuParentId: '-1',
    breadcrumbParentId: '9',
    name: 'Collection Details',
    route: '/collections/:id',
  },
  {
    id: '10',
    breadcrumbParentId: '1',
    name: 'Blogs',
    icon: 'bold',
    route: '/blogs',
  },
  {
    id: '10.1',
    menuParentId: '-1',
    breadcrumbParentId: '10',
    name: 'Blog Details',
    icon: 'bold',
    route: '/blogs/:id',
  },
  {
    id: '11',
    breadcrumbParentId: '1',
    name: 'Cron Jobs',
    icon: 'clock-circle',
    route: '/cron',
  },
  {
    id: '12',
    breadcrumbParentId: '1',
    menuParentId: '-1',
    name: 'Settings',
    route: '/settings',
  },
];

export default {
  menus,
};
