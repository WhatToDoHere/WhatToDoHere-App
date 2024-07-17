const USER_DATA = [
  {
    id: 1,
    title: '승휘',
    description: 'shmoon@gmail.com',
    userProfile: require('../assets/icons/icon-friends.png'),
  },
  {
    id: 2,
    title: '은미',
    description: 'eunmm@gmail.com',
    userProfile: require('../assets/icons/icon-friends.png'),
  },
];

const FRIENDS_DATA = [
  {
    id: '1',
    name: '김바코',
    email: 'john.doe@example.com',
    profileIcon: 'https://example.com/profile/john.jpg',
    todos: [
      {
        title: '알고리즘 풀기',
        details: 'Sweep and mop the floors.',
        image: 'https://example.com/clean-house.jpg',
      },
      {
        title: '세탁기 돌리기',
        details: 'Wash and fold clothes.',
        image: 'https://example.com/do-laundry.jpg',
      },
    ],
  },
  {
    id: '2',
    name: '문바코',
    email: 'jane.smith@example.com',
    profileIcon: 'https://example.com/profile/jane.jpg',
    todos: [
      {
        title: '회의록 작성하기',
        details: 'Complete the project documentation.',
        image: 'https://example.com/finish-project.jpg',
      },
      {
        title: '클라이언트에게 이메일 보내기',
        details: 'Send the project updates to the client.',
        image: 'https://example.com/email-client.jpg',
      },
    ],
  },
  {
    id: '3',
    name: '백바코',
    email: 'mike.johnson@example.com',
    profileIcon: 'https://example.com/profile/mike.jpg',
    todos: [
      {
        title: 'Workout',
        details: 'Complete the strength training routine.',
        image: 'https://example.com/workout.jpg',
      },
      {
        title: 'Swim',
        details: 'Swim 30 laps.',
        image: 'https://example.com/swim.jpg',
      },
    ],
  },
];

export { USER_DATA, FRIENDS_DATA };
