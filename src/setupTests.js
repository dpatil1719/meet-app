import '@testing-library/jest-dom';

const MESSAGES_TO_IGNORE = [
  'When testing, code that causes React state updates should be wrapped into act(...):',
];

const originalError = console.error.bind(console);
console.error = (...args) => {
  const message = args.map(String).join(' ');
  if (MESSAGES_TO_IGNORE.some((m) => message.includes(m))) return;
  originalError(...args);
};

/* ---- Recharts / ResizeObserver mock for Jest ---- */
const { ResizeObserver } = window;

beforeEach(() => {
  // @ts-ignore
  delete window.ResizeObserver;
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

afterEach(() => {
  window.ResizeObserver = ResizeObserver;
  jest.restoreAllMocks();
});
/* --- Recharts / ResponsiveContainer: ResizeObserver mock for tests --- */
const OriginalResizeObserver = global.ResizeObserver || window.ResizeObserver;

beforeEach(() => {
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(window, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: MockResizeObserver,
  });
  Object.defineProperty(global, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: MockResizeObserver,
  });
});

afterEach(() => {
  Object.defineProperty(window, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: OriginalResizeObserver,
  });
  Object.defineProperty(global, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: OriginalResizeObserver,
  });
});
/* --- end mock --- */
