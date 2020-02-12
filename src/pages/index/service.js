import Request from '../../utils/request';

export const demo = (data) => {
  return Request({
    url: 'http://www.baidu.com',
    method: 'POST',
    data,
  });
};
