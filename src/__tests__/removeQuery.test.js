import { removeQuery } from '../api';

describe('removeQuery()', () => {
  const originalHref = window.location.href;

  afterEach(() => {
    // restore original URL after each test
    window.history.pushState({}, '', originalHref);
  });

  test('strips query string but keeps protocol/host/pathname', () => {
    window.history.pushState({}, '', 'https://example.com/meet?code=abc&state=123');
    removeQuery();
    expect(window.location.href).toBe('https://example.com/meet');
  });

  test('handles root path "/"', () => {
    window.history.pushState({}, '', 'https://example.com/?code=abc');
    removeQuery();
    expect(window.location.href).toBe('https://example.com/');
  });
});
