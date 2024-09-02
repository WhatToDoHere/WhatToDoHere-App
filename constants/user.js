export const USER_MENU_ITEMS = [
  {
    id: 'completedTodo',
    icon: require('../assets/icons/icon-completed.png'),
    title: '완료 목록',
    link: 'users/completedTodo',
    guestAccessible: true,
  },
  {
    id: 'friendList',
    icon: require('../assets/icons/icon-friends.png'),
    title: '친구 목록',
    link: 'users/friends',
    guestLink: 'users/signIn',
    guestMessage: '로그인이 필요해요!',
    guestAccessible: true,
  },
  {
    id: 'addFriend',
    icon: require('../assets/icons/icon-add-friend.png'),
    title: '친구 추가',
    link: 'users/addFriend',
    guestLink: 'users/signIn',
    guestMessage: '로그인이 필요해요!',
    guestAccessible: true,
  },
  {
    id: 'accountSettings',
    icon: require('../assets/icons/icon-user-settings.png'),
    title: '계정 설정',
    link: 'users/settings',
    guestAccessible: false,
  },
];
