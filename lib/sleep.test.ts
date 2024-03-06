import sleep from './sleep';

jest.useFakeTimers(); // Use Jest's fake timers to control time

describe('sleep', () => {
  test('resolves after the specified duration', async () => {
    const sleepPromise = sleep(1000);
    expect(sleepPromise).toBeInstanceOf(Promise);

    // Fast-forward time by the duration
    jest.advanceTimersByTime(1000);

    expect(sleepPromise).resolves.toBeUndefined();
  });
});
