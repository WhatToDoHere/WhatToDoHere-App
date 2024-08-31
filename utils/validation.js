import { checkUsernameExists } from '../services/firebaseService';

export const validateUsername = async (name, currentUsername = '') => {
  if (name.length < 3 || name.length > 10) {
    return '사용자 이름은 3자 이상 10자 이하여야 합니다.';
  }
  if (!/^[a-zA-Z0-9._]+$/.test(name)) {
    return '사용자 이름은 알파벳, 숫자, 마침표(.), 밑줄(_)만 포함할 수 있습니다.';
  }
  if (/\.$/.test(name)) {
    return '사용자 이름은 마침표(.)로 끝날 수 없습니다.';
  }

  const isUsernameExists = await checkUsernameExists(name);
  if (
    isUsernameExists &&
    name.toLowerCase() !== currentUsername.toLowerCase()
  ) {
    return '이미 사용 중인 사용자 이름입니다. 다른 이름을 선택해 주세요.';
  }

  return null;
};
