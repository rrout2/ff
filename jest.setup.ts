import '@testing-library/jest-dom';

global.console = {
    ...console,
    warn: jest.fn(),
};
