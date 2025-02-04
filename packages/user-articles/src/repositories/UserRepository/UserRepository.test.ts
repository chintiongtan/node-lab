import UserRepository from './UserRepository';

const userRepository = UserRepository.getInstance();

describe('UserRepository', () => {
  test('create should add a new item to records', () => {
    userRepository.create({
      user_id: '10000',
      login: 'username@example.org',
      password: 'abc*123!',
    });

    expect(userRepository['records'].length).toEqual(1);
  });

  test('getUserByLogin should return user if found', () => {
    const user = userRepository.getUserByLogin('username@example.org');

    expect(user).toBeDefined();
    expect(user?.login).toEqual('username@example.org');
  });

  test('getUserByLogin should return undefined if not found', () => {
    const user = userRepository.getUserByLogin('no-such-user@example.org');

    expect(user).toBeUndefined();
  });
});
