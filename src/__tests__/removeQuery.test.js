import { removeQuery } from '../api';

describe('removeQuery()', () => {
  test('strips query string but keeps protocol/host/pathname', () => {
    const fakeLocation = {
      protocol: 'https:',
      host: 'example.com',
      pathname: '/meet',
      search: '?code=abc&state=123',
    };
    const pushState = jest.fn();
    removeQuery(fakeLocation, { pushState });
    expect(pushState).toHaveBeenCalledWith('', '', 'https://example.com/meet');
  });

  test('handles root path "/"', () => {
    const fakeLocation = {
      protocol: 'https:',
      host: 'example.com',
      pathname: '/',
      search: '?code=abc',
    };
    const pushState = jest.fn();
    removeQuery(fakeLocation, { pushState });
    expect(pushState).toHaveBeenCalledWith('', '', 'https://example.com/');
  });
});
