import faker from 'faker';

export const randomNum = (min = 0, max = 1000) => {
  return faker.random.number({ min, max });
};

export const getSessionStatus = i => {
  if (i % 4 === 3) {
    return '🔴';
  }
  if (i % 4 === 2) {
    return '🟡';
  }
  return '🟢';
};

export const previousDate = days => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, 0);
  const day = String(today.getDate() - days).padStart(2, 0);
  return `${month}/${day}`;
};
