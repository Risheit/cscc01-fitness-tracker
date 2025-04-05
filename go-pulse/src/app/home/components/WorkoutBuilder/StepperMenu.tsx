interface Props {
  name: string;
  value: number;
  displayed?: string;
  min: number;
  max?: number;
  onValueUpdate: (
    updated: number,
    changeType?: 'increase' | 'decrease' | 'manual'
  ) => void;
}

export default function StepperMenu({
  name,
  value,
  displayed,
  min,
  max,
  onValueUpdate,
}: Props) {
  function clamp(value: number) {
    if (!max)
      // No upper bound
      return Math.max(min, value);

    return Math.min(Math.max(min, value), max);
  }

  return (
    <div className="flex items-center">
      <button
        onClick={() => onValueUpdate(clamp(value - 1), 'decrease')}
        className="w-6 h-6 bg-gray-600 text-white text-sm rounded-full flex items-center justify-center"
        title={`Decrease ${name}`}
      >
        -
      </button>
      <input
        type="number"
        min={min}
        max={max}
        title={`Set number of ${name}`}
        value={value}
        onChange={(e) => onValueUpdate(clamp(Number(e.target.value)), 'manual')}
        onBlur={(e) => {
          if (e.target.value === '') {
            onValueUpdate(min);
          }
        }}
        style={{
          appearance: 'none', // Firefox
          WebkitAppearance: 'none', // Chrome, Safari, Edge
          MozAppearance: 'textfield', // Firefox (alternative)
        }}
        className="w-10 h-8 text-center bg-gray-800 text-white rounded-md border border-gray-600 mx-1"
      />
      {displayed && <p className="text-gray-400 text-md mr-2">{displayed}</p>}
      <button
        onClick={() => onValueUpdate(clamp(value + 1), 'increase')}
        title={`Increase ${name}`}
        className="w-6 h-6 bg-gray-600 text-white text-sm rounded-full flex items-center justify-center"
      >
        +
      </button>
    </div>
  );
}
