import faker from 'faker';

export const randomNum = (min = 0, max = 1000) => {
  return faker.random.number({ min, max });
};

export const getSessionStatus = record => {
  if (record.Session_Status === 'Short') {
    return '🔴';
  }
  if (record.Session_Status === 'Long') {
    return '🟡';
  }
  return '🟢';
};

export const formatDate = dateString => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
  // const month = String(date.getMonth() + 1).padStart(2, 0);
  // const day = String(date.getDate()).padStart(2, 0);
  // return `${month}/${day}`;
};
