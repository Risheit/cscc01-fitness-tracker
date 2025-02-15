"use client";

interface Exercise {
    id: number;
    name: string;
    youtube_url: string;
}

interface ExerciseSelectorProps {
    exercises: Exercise[];
    selectedVideoId: string;
    onSelect: (videoId: string) => void;
}

const ExerciseSelector = ({ exercises, selectedVideoId, onSelect }: ExerciseSelectorProps) => {
    return (
        <select
            onChange={(e) => onSelect(e.target.value)}
            value={selectedVideoId}
            className="mb-6 p-2 border border-gray-300 rounded"
        >
            {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.youtube_url}>
                    {exercise.name}
                </option>
            ))}
        </select>
    );
};

export default ExerciseSelector;




