import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TimedBottomSheet from '../workout/components/TimedBottomSheet';

describe('TimedBottomSheet Component', () => {
  it('should play an audio cue when the workout finishes', async () => {
    const mockPlay = vi.fn(); // Mock Audio.play()
    vi.spyOn(window, 'Audio').mockImplementation(() => ({
      play: mockPlay,
      pause: vi.fn(),
      src: '',
      currentTime: 0,
      volume: 1,
      loop: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as HTMLAudioElement));

    const mockOnCompletion = vi.fn();

    render(
      <TimedBottomSheet
        className=""
        data={{ name: 'Test Workout', mins: 0, type: 'Timed', description: 'Test Description',   imagePath: '/stock-running.jpg' }} // 0 mins to trigger instant completion
        onCompletion={mockOnCompletion}
      />
    );

    // Simulate time passing (since mins is 0, it should finish immediately)
    await act(() => new Promise((resolve) => setTimeout(resolve, 1100))); // Wait for setInterval to trigger

    // Check if the audio play function was called
    expect(mockPlay).toHaveBeenCalled();

    // Cleanup mock
    vi.restoreAllMocks();
  });
});
