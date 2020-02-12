import Request from '../../utils/request';

export const getData = () => {
  return Request({
    url: 'release/pneumonia',
    method: 'GET',
  });
};
